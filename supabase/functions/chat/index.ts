
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { characterPersonalities } from "./characters.ts";
import { getEventContext } from "./eventService.ts";
import { getDeepSeekResponse, getFallbackResponse } from "./deepSeekService.ts";
import { 
  corsHeaders, 
  Message, 
  handleCorsOptions, 
  createErrorResponse, 
  createSuccessResponse 
} from "../_shared/utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsOptions();
  }

  try {
    // Initialize Supabase client
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Get the DeepSeek API Key
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
    
    if (!DEEPSEEK_API_KEY) {
      console.error("DEEPSEEK_API_KEY is not set in environment variables");
      throw new Error("Missing API key configuration");
    }

    // Get the message from the request
    const { message, character = "tanit" } = await req.json() as Message;
    console.log(`Received message for ${character}:`, message);

    // Get character personality
    const personality = characterPersonalities[character as keyof typeof characterPersonalities] || characterPersonalities.tanit;

    // Check if the message is asking about events
    const isAskingAboutEvents = /party|parties|event|events|club|clubs|dance|music|dj|festival|fiesta|fiestas|cuando|fecha|dia|mayo|junio|julio|agosto/i.test(message);
    
    // Get event context if relevant
    const eventContext = await getEventContext(message, supabase);

    // Get response from DeepSeek API
    let response = await getDeepSeekResponse(message, personality, eventContext, DEEPSEEK_API_KEY);

    // If no response from API, use fallback
    if (!response) {
      console.log("Using fallback response generation");
      response = getFallbackResponse(message, personality, eventContext, isAskingAboutEvents);
    }

    // Return the response
    return createSuccessResponse(response);
  } catch (error) {
    console.error('Error:', error);
    return createErrorResponse("Estoy teniendo problemas para procesar tu solicitud en este momento. Por favor, inténtalo de nuevo más tarde.");
  }
});
