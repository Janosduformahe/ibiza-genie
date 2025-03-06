
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Define type for event data
export interface Event {
  id: string;
  name: string;
  date: string;
  club?: string;
  ticket_link?: string;
  music_style?: string[];
  lineup?: string[];
  price_range?: string;
  description?: string;
  source?: string;
}

export async function getEventContext(message: string, supabase: ReturnType<typeof createClient>): Promise<string> {
  // Check if the message is asking about events, dates or parties
  const isAskingAboutEvents = /party|parties|event|events|club|clubs|dance|music|dj|festival|fiesta|fiestas|cuando|fecha|dia|mayo|junio|julio|agosto/i.test(message);
  
  if (!isAskingAboutEvents) {
    return "";
  }
  
  console.log("User is asking about events, fetching event data");
  
  // Check if asking about a specific date
  const dateRegex = /(\d{1,2})(?:\s+de\s+|\s+|\/)?(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|january|february|march|april|may|june|july|august|september|october|november|december)/i;
  const dateMatch = message.match(dateRegex);
  
  let startDate: Date, endDate: Date;
  
  if (dateMatch) {
    // If a specific date is mentioned, search for that date
    console.log("User is asking about a specific date:", dateMatch[0]);
    const day = parseInt(dateMatch[1]);
    let month;
    
    // Map month names to month numbers (Spanish and English)
    const monthMap: {[key: string]: number} = {
      'enero': 0, 'january': 0,
      'febrero': 1, 'february': 1,
      'marzo': 2, 'march': 2,
      'abril': 3, 'april': 3,
      'mayo': 4, 'may': 4,
      'junio': 5, 'june': 5,
      'julio': 6, 'july': 6,
      'agosto': 7, 'august': 7,
      'septiembre': 8, 'september': 8,
      'octubre': 9, 'october': 9,
      'noviembre': 10, 'november': 10,
      'diciembre': 11, 'december': 11
    };
    
    month = monthMap[dateMatch[2].toLowerCase()];
    
    if (month !== undefined) {
      startDate = new Date();
      startDate.setMonth(month);
      startDate.setDate(day);
      
      // If the date is in the past for this year, assume next year
      if (startDate < new Date()) {
        startDate.setFullYear(startDate.getFullYear() + 1);
      }
      
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1); // Just one day
    } else {
      startDate = new Date();
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 14);
    }
  } else {
    // If no specific date was found, get the next 2 weeks
    startDate = new Date();
    endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);
  }
  
  console.log(`Searching for events between ${startDate.toISOString()} and ${endDate.toISOString()}`);
  
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString())
    .order('date', { ascending: true })
    .limit(10);
  
  if (error) {
    console.error("Error fetching events:", error);
    return "";
  } 
  
  if (!events || events.length === 0) {
    console.log("No upcoming events found for the requested date");
    if (dateMatch) {
      return `No tengo información sobre fiestas para el ${dateMatch[1]} de ${dateMatch[2]}. Te recomiendo consultar más adelante, ya que actualizamos nuestro calendario regularmente.`;
    } else {
      return "No veo ninguna fiesta programada en las próximas dos semanas. Te recomiendo consultar más adelante, ya que actualizamos nuestro calendario regularmente.";
    }
  }
  
  console.log(`Found ${events.length} upcoming events to include in context`);
  
  // Format events for context
  let eventContext = "Aquí tienes información sobre las fiestas que buscas:\n\n";
  events.forEach((event: Event) => {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
    
    eventContext += `- ${event.name} en ${event.club || 'Ibiza'} el ${formattedDate}\n`;
    if (event.music_style && event.music_style.length > 0) {
      eventContext += `  Estilo musical: ${event.music_style.join(', ')}\n`;
    }
    if (event.lineup && event.lineup.length > 0) {
      eventContext += `  Line-up: ${event.lineup.join(', ')}\n`;
    }
    if (event.price_range) {
      eventContext += `  Precio: ${event.price_range}\n`;
    }
    eventContext += `  Entradas: ${event.ticket_link || 'No disponibles todavía'}\n\n`;
  });
  
  return eventContext;
}
