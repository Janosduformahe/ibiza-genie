
import { CharacterPersonality } from "./characters.ts";

interface DeepSeekMessage {
  role: string;
  content: string;
}

export async function getDeepSeekResponse(
  message: string, 
  personality: CharacterPersonality, 
  eventContext: string,
  apiKey: string
): Promise<string> {
  // Create prompt for DeepSeek based on the selected character
  let prompt = `
  Eres ${personality.name}, un asistente virtual especializado en Ibiza con una personalidad ${personality.traits}
  
  Tu objetivo es ayudar a los usuarios a descubrir lo mejor de la isla, especialmente ${personality.interests}.
  
  Responde siempre en español de forma amigable y concisa.

  Información del usuario: "${message}"
  `;

  // Add event context if available
  if (eventContext) {
    prompt += `\n\nDatos sobre eventos disponibles:\n${eventContext}`;
  }

  console.log("Calling DeepSeek API with prompt for", personality.name);
  
  try {
    const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `Eres ${personality.name}, un asistente virtual especializado en Ibiza. ${personality.traits} Te centras en ${personality.interests}. Responde siempre en español de manera amigable, útil y concisa.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    // Parse API response
    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text();
      console.error("DeepSeek API Error:", deepseekResponse.status, errorText);
      throw new Error(`DeepSeek API error: ${deepseekResponse.status}`);
    }

    const data = await deepseekResponse.json();
    console.log("Received response from DeepSeek API");

    // Get response text from the API
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    }
    
    // Log unexpected response format
    console.error("Unexpected DeepSeek API response format:", JSON.stringify(data));
    return "";
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    return "";
  }
}

export function getFallbackResponse(message: string, personality: CharacterPersonality, eventContext: string, isAskingAboutEvents: boolean): string {
  // Use basic response logic as fallback
  if (message.toLowerCase().includes("hola") || message.toLowerCase().includes("hi") || message.toLowerCase().includes("hello")) {
    return `¡Hola! Soy ${personality.name}, tu guía virtual de Ibiza. ¿Cómo puedo ayudarte a planificar tu experiencia en Ibiza hoy?`;
  } 
  
  if (isAskingAboutEvents) {
    return `${eventContext}\n\n¿Hay algo específico que te gustaría saber sobre estos eventos?`;
  } 
  
  if (message.toLowerCase().includes("playa") || message.toLowerCase().includes("playas") || message.toLowerCase().includes("beach")) {
    if (personality.name === "Tanit") {
      return "¡Ibiza tiene algunas de las playas más hermosas del Mediterráneo! 🏝️ Te recomiendo visitar Cala Comte para ver el atardecer, Aguas Blancas si buscas una experiencia naturista, o la tranquila Cala Xarraca para conectar con la naturaleza. ¿Qué tipo de experiencia playera buscas? ☀️";
    } else {
      return "¡Las playas de Ibiza no son solo para relajarse, también para la fiesta! 🔥 Playa d'en Bossa tiene los mejores beach clubs como Ushuaïa y Bora Bora. En Cala Jondal encontrarás el exclusivo Blue Marlin. ¿Buscas fiesta de día o un beach club específico? 💃";
    }
  } 
  
  if (message.toLowerCase().includes("restaurante") || message.toLowerCase().includes("comida") || message.toLowerCase().includes("comer") || message.toLowerCase().includes("food")) {
    if (personality.name === "Tanit") {
      return "Ibiza tiene opciones gastronómicas maravillosas y sostenibles 🌿 Te recomiendo Wild Beets para comida vegetariana de calidad, Aubergine con productos de su huerto ecológico, o La Paloma para una experiencia farm-to-table en un jardín precioso. ¿Prefieres algún tipo de cocina en particular?";
    } else {
      return "¡La gastronomía en Ibiza también es pura fiesta! 🍾 STK ofrece cenas con DJs y ambiente de club, Lío combina gastronomía, espectáculo y discoteca, y Heart Ibiza es una experiencia sensorial única creada por los hermanos Adrià. ¿Buscas cenar y seguir de fiesta?";
    }
  } 
  
  if (personality.name === "Tanit") {
    return "Ibiza es mucho más que fiestas... es una isla con energía especial, naturaleza impresionante y aguas cristalinas. ¿Te gustaría descubrir algún rincón tranquilo, practicar yoga frente al mar o conocer mercadillos ecológicos? 🌊";
  } else {
    return "¡Ibiza es el paraíso de la fiesta! 🔥 Con los mejores DJs del mundo, clubes legendarios como Pacha, Amnesia y Hï, y eventos que no puedes perderte. ¿Quieres saber qué artistas tocan pronto o qué club es mejor para tu estilo? 💃";
  }
}
