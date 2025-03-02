
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

    // Check if the message is asking about events
    const isAskingAboutEvents = /party|parties|event|events|club|clubs|dance|music|dj|festival/i.test(message);
    
    let eventContext = "";
    
    // If asking about events, fetch upcoming events to provide context
    if (isAskingAboutEvents) {
      console.log("User is asking about events, fetching event data");
      
      // Get the next 2 weeks of events
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 14);
      
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
        eventContext = "Here are some upcoming parties:\n\n";
        events.forEach((event: Event) => {
          const eventDate = new Date(event.date);
          eventContext += `- ${event.name} at ${event.club || 'Ibiza'} on ${eventDate.toDateString()}\n`;
          if (event.music_style && event.music_style.length > 0) {
            eventContext += `  Music style: ${event.music_style.join(', ')}\n`;
          }
          if (event.lineup && event.lineup.length > 0) {
            eventContext += `  Lineup: ${event.lineup.join(', ')}\n`;
          }
          if (event.price_range) {
            eventContext += `  Price: ${event.price_range}\n`;
          }
          eventContext += `  Tickets: ${event.ticket_link || 'Not available yet'}\n\n`;
        });
      } else {
        console.log("No upcoming events found");
        eventContext = "I don't see any parties scheduled in the next two weeks. You might want to check our calendar later as we update it regularly.";
      }
    }

    // Create a response based on the message and event context
    let response = "";
    
    if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
      response = "¡Hola! I'm Biza, your Ibiza AI guide. How can I help you plan your Ibiza experience today?";
    } else if (isAskingAboutEvents) {
      response = `Let me tell you about parties and events in Ibiza!\n\n${eventContext}\n\nIs there anything specific you'd like to know about these events?`;
    } else if (message.toLowerCase().includes("beach") || message.toLowerCase().includes("beaches")) {
      response = "Ibiza has some of the most beautiful beaches in the Mediterranean! Popular spots include Playa d'en Bossa, Cala Comte, and Las Salinas. Would you like recommendations for specific types of beaches?";
    } else if (message.toLowerCase().includes("restaurant") || message.toLowerCase().includes("food") || message.toLowerCase().includes("eat")) {
      response = "Ibiza has amazing culinary options! From beach clubs like Nikki Beach to fine dining at restaurants like Sublimotion. What type of cuisine or atmosphere are you looking for?";
    } else {
      response = "Ibiza is a magical island with beautiful beaches, incredible nightlife, and cultural experiences. What aspect of Ibiza would you like to explore?";
    }

    // Return the response
    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({ response: "I'm having trouble processing your request right now. Please try again later." }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
