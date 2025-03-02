
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

const JIGSAW_API_URL = "https://api.jigsawstack.com/v1/web/ai_scrape"

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get JIGSAW API key from environment variables
    const JIGSAW_API_KEY = Deno.env.get('JIGSAW')
    if (!JIGSAW_API_KEY) {
      console.error('Missing JIGSAW API key')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing JIGSAW API key. Please set it in your Supabase Edge Function secrets.'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Parse request body
    const requestData = await req.json().catch(() => ({}))
    const maxPages = requestData.maxPages || 12
    console.log(`Starting Jigsaw scraper with maxPages=${maxPages}`)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing Supabase credentials'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Configure the AI scraping parameters for multiple Ibiza event websites
    const scrapeTargets = [
      {
        url: "https://www.clubtickets.com/es/ibiza",
        source: "clubtickets.com"
      },
      {
        url: "https://www.ibiza-spotlight.com/clubbing/calendar",
        source: "ibiza-spotlight.com"
      }
    ]

    let totalInsertedCount = 0
    const results = []

    // Process each target website
    for (const target of scrapeTargets) {
      console.log(`Scraping ${target.url} for Ibiza events...`)
      
      const aiScrapeParams = {
        url: target.url,
        prompt: `Extract all upcoming parties and events in Ibiza from this website. For each event, I need:
        1. Event name (string)
        2. Date and time in ISO format (string in format YYYY-MM-DDTHH:MM:SS)
        3. Club/venue name (string)
        4. Ticket link (full URL string)
        5. Music style/genre (array of strings)
        6. Lineup/DJs (array of strings with artist names)
        7. Price range (string)
        8. Description (string with brief event description)
        
        Return a JSON array of objects, where each object represents an event with these properties.
        If any field is not available, return null for that field.
        Try to extract as many events as possible, especially for future dates.`,
        parsing_strategy: "structured",
        max_pages: maxPages, 
      }

      try {
        // Make request to Jigsaw AI Scrape API
        console.log(`Calling Jigsaw AI Scrape API for ${target.source}...`)
        const response = await fetch(JIGSAW_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': JIGSAW_API_KEY,
            ...corsHeaders
          },
          body: JSON.stringify(aiScrapeParams)
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Jigsaw API Error for ${target.source}:`, errorText)
          results.push({
            source: target.source,
            success: false,
            error: `API error: ${response.status} ${errorText}`
          })
          continue
        }

        const jigsawData = await response.json()
        console.log(`Jigsaw AI response received for ${target.source}:`, 
          JSON.stringify(jigsawData).substring(0, 200) + '...')

        // Extract events from Jigsaw response
        let eventsData = []
        
        if (jigsawData.data && Array.isArray(jigsawData.data)) {
          eventsData = jigsawData.data
        } else if (jigsawData.content) {
          // Try to parse content as JSON if it's a string
          try {
            if (typeof jigsawData.content === 'string') {
              const parsed = JSON.parse(jigsawData.content)
              if (Array.isArray(parsed)) {
                eventsData = parsed
              } else if (parsed.events && Array.isArray(parsed.events)) {
                eventsData = parsed.events
              }
            } else if (Array.isArray(jigsawData.content)) {
              eventsData = jigsawData.content
            }
          } catch (e) {
            console.error(`Failed to parse Jigsaw content as JSON for ${target.source}:`, e)
          }
        }

        console.log(`Found ${eventsData.length} events to process from ${target.source}`)
        
        let insertedCount = 0
        let skippedCount = 0
        const sampleEvents = []

        // Process and insert events
        for (const event of eventsData) {
          // Skip if missing essential data
          if (!event.name) {
            console.log('Skipping event with missing name:', event)
            skippedCount++
            continue
          }
          
          // Try to validate and format the date
          let eventDate = null
          if (event.date) {
            try {
              eventDate = new Date(event.date).toISOString()
              // Skip past events
              const today = new Date()
              if (new Date(eventDate) < today) {
                console.log(`Skipping past event: ${event.name} on ${eventDate}`)
                skippedCount++
                continue
              }
            } catch (e) {
              console.log(`Invalid date format for event ${event.name}: ${event.date}`)
              // If date is invalid, try to continue but use current date
              eventDate = new Date().toISOString()
            }
          } else {
            console.log('Skipping event with missing date:', event)
            skippedCount++
            continue
          }

          // Format the event data for insertion
          const eventData = {
            name: event.name,
            date: eventDate,
            club: event.club || event.venue,
            ticket_link: event.ticket_link || event.ticketLink,
            music_style: Array.isArray(event.music_style) ? event.music_style : 
                        (typeof event.music_style === 'string' ? [event.music_style] : 
                        (event.genre ? (Array.isArray(event.genre) ? event.genre : [event.genre]) : null)),
            lineup: Array.isArray(event.lineup) ? event.lineup : 
                  (typeof event.lineup === 'string' ? [event.lineup] :
                  (event.djs ? (Array.isArray(event.djs) ? event.djs : [event.djs]) : null)),
            price_range: event.price_range || event.price,
            description: event.description,
            source: target.source
          }

          if (sampleEvents.length < 2) {
            sampleEvents.push(eventData)
          }

          // Check if this event already exists (by name and date)
          const { data: existingEvents, error: checkError } = await supabase
            .from('events')
            .select('id')
            .eq('name', eventData.name)
            .eq('date', eventData.date)

          if (checkError) {
            console.error('Error checking for existing event:', checkError)
            continue
          }

          // If event doesn't exist, insert it
          if (!existingEvents || existingEvents.length === 0) {
            const { error: insertError } = await supabase
              .from('events')
              .insert(eventData)

            if (insertError) {
              console.error('Error inserting event:', insertError)
            } else {
              insertedCount++
              totalInsertedCount++
            }
          } else {
            console.log(`Event already exists: ${eventData.name} on ${eventData.date}`)
            skippedCount++
          }
        }

        results.push({
          source: target.source,
          success: true,
          inserted: insertedCount,
          skipped: skippedCount,
          sample: sampleEvents
        })
        
        console.log(`Successfully processed ${insertedCount} new events from ${target.source}`)
        console.log(`Skipped ${skippedCount} events from ${target.source}`)

      } catch (error) {
        console.error(`Error scraping ${target.source}:`, error)
        results.push({
          source: target.source,
          success: false,
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraped and processed ${totalInsertedCount} new events`,
        count: totalInsertedCount,
        results: results
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  } catch (error) {
    console.error('Error in scrape-jigsaw function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})
