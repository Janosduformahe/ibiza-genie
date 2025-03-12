
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface MessagePayload {
  phoneNumber: string;
  character?: string;
}

interface MessageRequest {
  message: MessagePayload;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define personality traits for each character
const characterGreetings = {
  tanit: "¡Hola! Soy Tanit 🌊, tu guía para descubrir la naturaleza y tranquilidad de Ibiza. Puedes preguntarme sobre playas escondidas, rutas de senderismo, yoga, gastronomía sostenible y todo lo relacionado con el bienestar y la belleza natural de nuestra isla. ¿En qué puedo ayudarte hoy? ☀️",
  dionisio: "¡Hey! Soy Dionisio 🔥, tu conexión con la mejor fiesta de Ibiza! Pregúntame sobre clubes, DJs, eventos especiales, fiestas en barco, pool parties y todo lo que necesitas para vivir la experiencia de fiesta definitiva en la isla. ¿Listo para la acción? 💃🎉"
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error("Missing Twilio configuration");
    }

    const { message } = await req.json() as MessageRequest;
    
    if (!message || !message.phoneNumber) {
      throw new Error("Missing phone number");
    }

    // Get the character, default to tanit
    const character = message.character || "tanit";
    const greeting = characterGreetings[character as keyof typeof characterGreetings] || characterGreetings.tanit;

    const phoneNumber = message.phoneNumber.startsWith('+') 
      ? message.phoneNumber 
      : `+${message.phoneNumber}`;

    // Format phone number for WhatsApp
    const whatsappNumber = `whatsapp:${phoneNumber}`;
    
    // Construct the URL for the Twilio API request
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    
    // Send the message via Twilio
    const twilioResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`
      },
      body: new URLSearchParams({
        From: `whatsapp:${TWILIO_PHONE_NUMBER}`,
        To: whatsappNumber,
        Body: greeting
      }).toString()
    });

    if (!twilioResponse.ok) {
      const error = await twilioResponse.json();
      console.error("Twilio API error:", error);
      throw new Error(`Error sending WhatsApp message: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in WhatsApp function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
