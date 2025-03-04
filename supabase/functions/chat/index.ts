
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define type for incoming message
interface Message {
  message: string;
}

// Define type for event data
interface Event {
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Get the message from the request
    const { message } = await req.json() as Message;
    console.log("Received message:", message);

    // Check if the message is asking about events, dates or parties
    const isAskingAboutEvents = /party|parties|event|events|club|clubs|dance|music|dj|festival|fiesta|fiestas|cuando|fecha|dia|mayo|junio|julio|agosto/i.test(message);
    
    let eventContext = "";
    
    // If asking about events, fetch upcoming events to provide context
    if (isAskingAboutEvents) {
      console.log("User is asking about events, fetching event data");
      
      // Check if asking about a specific date
      const dateRegex = /(\d{1,2})(?:\s+de\s+|\s+|\/)?(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|january|february|march|april|may|june|july|august|september|october|november|december)/i;
      const dateMatch = message.match(dateRegex);
      
      let startDate, endDate;
      
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
        }
      }
      
      // If no specific date was found, get the next 2 weeks
      if (!startDate || !endDate) {
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
      } else if (events && events.length > 0) {
        console.log(`Found ${events.length} upcoming events to include in context`);
        
        // Format events for context
        eventContext = "Aquí tienes información sobre las fiestas que buscas:\n\n";
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
      } else {
        console.log("No upcoming events found for the requested date");
        if (dateMatch) {
          eventContext = `No tengo información sobre fiestas para el ${dateMatch[1]} de ${dateMatch[2]}. Te recomiendo consultar más adelante, ya que actualizamos nuestro calendario regularmente.`;
        } else {
          eventContext = "No veo ninguna fiesta programada en las próximas dos semanas. Te recomiendo consultar más adelante, ya que actualizamos nuestro calendario regularmente.";
        }
      }
    }

    // Create a response based on the message and event context
    let response = "";
    
    if (message.toLowerCase().includes("hola") || message.toLowerCase().includes("hi") || message.toLowerCase().includes("hello")) {
      response = "¡Hola! Soy Biza, tu guía virtual de Ibiza. ¿Cómo puedo ayudarte a planificar tu experiencia en Ibiza hoy?";
    } else if (isAskingAboutEvents) {
      response = `${eventContext}\n\n¿Hay algo específico que te gustaría saber sobre estos eventos?`;
    } else if (message.toLowerCase().includes("playa") || message.toLowerCase().includes("playas") || message.toLowerCase().includes("beach")) {
      response = "¡Ibiza tiene algunas de las playas más hermosas del Mediterráneo! Lugares populares incluyen Playa d'en Bossa, Cala Comte y Las Salinas. ¿Te gustaría recomendaciones para algún tipo específico de playa?";
    } else if (message.toLowerCase().includes("restaurante") || message.toLowerCase().includes("comida") || message.toLowerCase().includes("comer") || message.toLowerCase().includes("food")) {
      response = "Ibiza tiene opciones culinarias increíbles! Desde beach clubs como Nikki Beach hasta restaurantes de alta cocina como Sublimotion. ¿Qué tipo de cocina o ambiente estás buscando?";
    } else if (message.toLowerCase().includes("como funciona") || message.toLowerCase().includes("how do you work") || message.toLowerCase().includes("como eres")) {
      response = "Soy Biza, un asistente virtual especializado en Ibiza. Funciono utilizando inteligencia artificial para responder a tus preguntas sobre la isla. Tengo información sobre eventos, fiestas, restaurantes, playas y más. Mi conocimiento proviene de una base de datos de eventos en Ibiza y de información general sobre la isla. Cuando me preguntas sobre fiestas o eventos, consulto mi base de datos para darte información actualizada. ¡Estoy aquí para hacer que tu experiencia en Ibiza sea inolvidable!";
    } else {
      response = "Ibiza es una isla mágica con hermosas playas, increíble vida nocturna y experiencias culturales. ¿Qué aspecto de Ibiza te gustaría explorar?";
    }

    // Return the response
    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({ response: "Estoy teniendo problemas para procesar tu solicitud en este momento. Por favor, inténtalo de nuevo más tarde." }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
