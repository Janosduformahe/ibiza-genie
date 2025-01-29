import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    const BIZA_KEY = Deno.env.get('BIZA 1')
    
    if (!BIZA_KEY) {
      throw new Error('BIZA API key not configured')
    }

    // Fetch recent events from the database to provide context
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: events } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
      .limit(5)

    // Prepare context with events
    const eventsContext = events ? events.map(event => 
      `${event.name} at ${event.club} on ${new Date(event.date).toLocaleDateString()} - ${event.description}`
    ).join('\n') : ''

    // Call Groq API instead of DeepSeek
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BIZA_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama2-70b-4096",
        messages: [
          {
            role: "system",
            content: `You are Biza, an AI assistant named after the magical island of Ibiza. You have a warm, friendly personality and deep knowledge of Ibiza's culture, especially its legendary party scene. You speak in a casual, upbeat tone and occasionally use Spanish phrases.

Here are some upcoming events you can recommend:
${eventsContext}

When recommending events, be enthusiastic and provide specific details about the venue, music style, and what makes each event special. If you don't have specific event information for what the user is asking about, you can still provide general guidance about Ibiza's party scene and culture.`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    const result = await response.json()
    console.log('API Response:', result)
    
    if (!response.ok) {
      console.error('API error:', result)
      throw new Error(result.error?.message || 'Failed to get response from API')
    }

    return new Response(
      JSON.stringify({ 
        response: result.choices[0].message.content 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})