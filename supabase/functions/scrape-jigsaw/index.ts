
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
      throw new Error('Missing JIGSAW API key')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Starting Jigsaw AI scraper for ClubTickets...')

    // Configure the AI scraping parameters for ClubTickets
    const aiScrapeParams = {
      url: "https://www.clubtickets.com/es/",
      prompt: `Extract all upcoming events in Ibiza from this website. For each event, find the following details:
      1. Event name
      2. Date and time in ISO format
      3. Club/venue name
      4. Ticket link (full URL)
      5. Music style/genre (as an array of tags)
      6. Lineup/DJs (as an array of names)
      7. Price range (if available)
      8. Description (brief summary of the event)
      
      Create a comprehensive, structured list of all events with these details. If the webpage shows event listings, navigate to event detail pages if needed to gather complete information. If a field is not available, return null for that field.`,
      parsing_strategy: "structured", // We want structured data
      max_pages: 10, // Limit to 10 pages to avoid excessive scraping
    }

    // Make request to Jigsaw AI Scrape API
    console.log('Calling Jigsaw AI Scrape API...')
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
      console.error('Jigsaw API Error:', errorText)
      throw new Error(`Jigsaw API error: ${response.status} ${errorText}`)
    }

    const jigsawData = await response.json()
    console.log('Jigsaw AI response received:', JSON.stringify(jigsawData).substring(0, 200) + '...')

    // Process the scraped data
    let eventsData = []
    let insertedCount = 0

    try {
      // Extract events from Jigsaw response
      // The actual structure might vary based on Jigsaw's response format
      if (jigsawData.data && Array.isArray(jigsawData.data)) {
        eventsData = jigsawData.data
      } else if (jigsawData.content && typeof jigsawData.content === 'string') {
        // Try to parse content as JSON if it's a string
        try {
          const parsed = JSON.parse(jigsawData.content)
          if (Array.isArray(parsed)) {
            eventsData = parsed
          } else if (parsed.events && Array.isArray(parsed.events)) {
            eventsData = parsed.events
          }
        } catch (e) {
          console.error('Failed to parse Jigsaw content as JSON:', e)
        }
      }

      console.log(`Found ${eventsData.length} events to process`)

      // Process and insert events
      for (const event of eventsData) {
        // Skip if missing essential data
        if (!event.name || !event.date) {
          console.log('Skipping event with missing name or date:', event)
          continue
        }

        // Format the event data for insertion
        const eventData = {
          name: event.name,
          date: new Date(event.date).toISOString(),
          club: event.club || event.venue,
          ticket_link: event.ticket_link || event.ticketLink,
          music_style: Array.isArray(event.music_style) ? event.music_style : 
                       (event.genre ? [event.genre] : null),
          lineup: Array.isArray(event.lineup) ? event.lineup : 
                 (event.djs ? [event.djs] : null),
          price_range: event.price_range || event.price,
          description: event.description,
          source: 'jigsawstack'
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
          }
        } else {
          console.log(`Event already exists: ${eventData.name} on ${eventData.date}`)
        }
      }

      console.log(`Successfully processed ${insertedCount} new events`)

    } catch (processingError) {
      console.error('Error processing scraped data:', processingError)
      throw processingError
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraped and processed ${insertedCount} events`,
        count: insertedCount,
        events: eventsData.slice(0, 3) // Return first 3 events as sample
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
