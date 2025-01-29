import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting party scraping process...')
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch the Ibiza Spotlight party calendar page
    const response = await fetch('https://www.ibiza-spotlight.com/night/club-calendar')
    const html = await response.text()
    
    // Parse the HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    if (!doc) {
      throw new Error('Failed to parse HTML')
    }

    // Extract events from the page
    const events = []
    const eventElements = doc.querySelectorAll('.event-item') // Adjust selector based on actual HTML structure
    
    eventElements.forEach((element) => {
      const name = element.querySelector('.event-title')?.textContent?.trim()
      const dateText = element.querySelector('.event-date')?.textContent?.trim()
      const club = element.querySelector('.event-venue')?.textContent?.trim()
      const ticketLink = element.querySelector('.ticket-link')?.getAttribute('href')
      
      if (name && dateText) {
        const date = new Date(dateText)
        events.push({
          name,
          date: date.toISOString(),
          club,
          ticket_link: ticketLink,
        })
      }
    })

    console.log(`Found ${events.length} events`)

    // Insert events into the database
    for (const event of events) {
      const { error } = await supabase
        .from('events')
        .upsert(
          {
            name: event.name,
            date: event.date,
            club: event.club,
            ticket_link: event.ticket_link,
          },
          {
            onConflict: 'name,date',
          }
        )

      if (error) {
        console.error('Error inserting event:', error)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${events.length} events` 
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