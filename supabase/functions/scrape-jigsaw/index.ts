
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_npm

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1'
import { JigsawStack } from 'https://esm.sh/jigsawstack@0.0.27'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define the Jigsaw API key from Supabase secrets
const JIGSAW_API_KEY = Deno.env.get('JIGSAW') || ''

// Initialize the Jigsaw client
const jigsaw = new JigsawStack(JIGSAW_API_KEY)

// Event interface to match our database schema
interface Event {
  name: string
  date: string
  club?: string
  ticket_link?: string
  music_style?: string[]
  lineup?: string[]
  description?: string
  source: string
  price_range?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Jigsaw scraper with maxPages=30')
    
    // Parse the request body
    const { maxPages = 30 } = await req.json()
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Define sources to scrape (only using the two supported sites)
    const sources = [
      {
        name: 'ibiza-spotlight.com',
        url: 'https://www.ibiza-spotlight.com/clubbing/calendar',
      },
      {
        name: 'clubtickets.com',
        url: 'https://www.clubtickets.com/es/ibiza',
      }
    ]
    
    // Track results for each source
    const results = []
    let totalInsertedCount = 0
    
    // Process each source
    for (const source of sources) {
      try {
        console.log(`Calling Jigsaw AI Scrape API for ${source.name}...`)
        console.log(`Scraping ${source.url} for Ibiza events...`)
        
        // Define the scraping prompt based on the source
        const model = 'gpt-4o'
        let prompt = `Extract all party and event information from this Ibiza events webpage. For each event, extract:
          - Name of the event/party
          - Date (in ISO format YYYY-MM-DD)
          - Time (if available)
          - Club/venue name
          - Ticket link (if available)
          - Price range (if available)
          - Music style/genre (as an array of strings)
          - Lineup (as an array of DJs/artists)
          - Brief description (if available)
          
          Return the data as a clean JSON array of objects with these properties: name, date, club, ticket_link, price_range, music_style (array), lineup (array), description`
        
        // Customize prompt slightly for each source if needed
        if (source.name === 'ibiza-spotlight.com') {
          prompt += '\nNote: Pay special attention to the event calendar format on Ibiza Spotlight.'
        } else if (source.name === 'clubtickets.com') {
          prompt += '\nNote: This site sells tickets so make sure to capture the correct URLs and pricing information.'
        }
        
        // Call Jigsaw AI to scrape the website
        const data = await jigsaw.webScrape({
          url: source.url,
          prompt: prompt,
          maxPages: maxPages,
          model: model,
          scrollToBottom: false,
          navigationTimeout: 30000,
          waitForSelector: source.name === 'ibiza-spotlight.com' ? '.event' : '.event-item'
        })
        
        // Process the scraped data
        let scrapedEvents = []
        
        if (data && typeof data === 'string') {
          // Try to parse the response as JSON
          try {
            const parsed = JSON.parse(data)
            if (Array.isArray(parsed)) {
              scrapedEvents = parsed
            } else if (parsed.data && Array.isArray(parsed.data)) {
              scrapedEvents = parsed.data
            }
          } catch (parseError) {
            console.error(`Error parsing JSON response from Jigsaw for ${source.name}:`, parseError)
            
            // Try to extract JSON from text response (sometimes Jigsaw wraps JSON in text)
            const jsonMatch = data.match(/\[[\s\S]*?\]/)
            if (jsonMatch) {
              try {
                scrapedEvents = JSON.parse(jsonMatch[0])
              } catch (matchError) {
                console.error(`Failed to extract JSON from text for ${source.name}:`, matchError)
              }
            }
          }
        }
        
        console.log(`Extracted ${scrapedEvents.length} events from ${source.name}`)
        
        // Transform and validate events
        const validEvents: Event[] = []
        const invalidEvents: any[] = []
        
        for (const event of scrapedEvents) {
          try {
            // Basic validation
            if (!event.name || !event.date) {
              invalidEvents.push({ ...event, reason: 'Missing required fields' })
              continue
            }
            
            // Parse and validate date
            let eventDate: Date
            
            // Handle different date formats
            if (typeof event.date === 'string') {
              // If time is separate, try to combine
              let dateString = event.date
              if (event.time && typeof event.time === 'string') {
                dateString = `${dateString} ${event.time}`
              }
              
              // Try different date formats
              try {
                // First try direct ISO parsing
                eventDate = new Date(dateString)
                
                // Check if valid
                if (isNaN(eventDate.getTime())) {
                  // Try some common European formats (DD/MM/YYYY)
                  const dateParts = dateString.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/)
                  if (dateParts) {
                    eventDate = new Date(`${dateParts[3]}-${dateParts[2].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`)
                  }
                }
                
                // If still invalid, reject
                if (isNaN(eventDate.getTime())) {
                  throw new Error('Invalid date format')
                }
              } catch (dateError) {
                invalidEvents.push({ ...event, reason: 'Invalid date format', error: dateError.message })
                continue
              }
            } else {
              invalidEvents.push({ ...event, reason: 'Date is not a string' })
              continue
            }
            
            // Format arrays properly
            const music_style = Array.isArray(event.music_style) 
              ? event.music_style 
              : (typeof event.music_style === 'string' ? [event.music_style] : [])
            
            const lineup = Array.isArray(event.lineup) 
              ? event.lineup 
              : (typeof event.lineup === 'string' ? [event.lineup] : [])
            
            // Create a valid event object
            const validEvent: Event = {
              name: event.name,
              date: eventDate.toISOString(),
              club: event.club || event.venue || undefined,
              ticket_link: event.ticket_link || undefined,
              music_style: music_style,
              lineup: lineup,
              description: event.description || undefined,
              price_range: event.price_range || undefined,
              source: source.name
            }
            
            validEvents.push(validEvent)
          } catch (validationError) {
            invalidEvents.push({ ...event, reason: 'Validation error', error: validationError.message })
          }
        }
        
        console.log(`${validEvents.length} valid events, ${invalidEvents.length} invalid events from ${source.name}`)
        
        // Insert valid events into the database
        let insertedCount = 0
        let skippedCount = 0
        
        // Insert events in batches to avoid timeouts
        const BATCH_SIZE = 20
        for (let i = 0; i < validEvents.length; i += BATCH_SIZE) {
          const batch = validEvents.slice(i, i + BATCH_SIZE)
          
          // Insert events with upsert to avoid duplicates
          const { data: insertedData, error: insertError } = await supabase
            .from('events')
            .upsert(
              batch,
              { 
                onConflict: 'name,date,source',
                ignoreDuplicates: true 
              }
            )
          
          if (insertError) {
            console.error(`Error inserting events batch from ${source.name}:`, insertError)
          } else {
            // Count inserted vs skipped (duplicates)
            insertedCount += batch.length - (insertError ? batch.length : 0)
            skippedCount += insertError ? batch.length : 0
          }
        }
        
        totalInsertedCount += insertedCount
        
        // Record results for this source
        results.push({
          source: source.name,
          success: true,
          inserted: insertedCount,
          skipped: skippedCount,
          invalid: invalidEvents.length
        })
        
        console.log(`Successfully added ${insertedCount} events from ${source.name}, skipped ${skippedCount} duplicates`)
      } catch (sourceError) {
        console.error(`Jigsaw API Error for ${source.name}:`, sourceError)
        results.push({
          source: source.name,
          success: false,
          error: sourceError.message || 'Unknown error'
        })
      }
    }
    
    // Return the results
    return new Response(
      JSON.stringify({
        success: true,
        count: totalInsertedCount,
        results: results
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      }
    )
  } catch (error) {
    console.error('Error in scrape-jigsaw function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      }
    )
  }
})
