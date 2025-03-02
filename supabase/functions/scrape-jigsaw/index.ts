
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.37.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const jigsawApiKey = Deno.env.get("JIGSAW") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting Jigsaw scraper function");
    
    if (!jigsawApiKey) {
      console.error("JIGSAW secret is not set");
      return new Response(
        JSON.stringify({ error: "JIGSAW API key not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Extract request body to check for force flag and any custom URLs
    const requestData = await req.json().catch(() => ({}));
    const forceUpdate = requestData.force === true;
    const customUrls = Array.isArray(requestData.urls) ? requestData.urls : null;
    
    // URLs to scrape - use custom URLs if provided, otherwise use default
    const urlsToScrape = customUrls || [
      "https://www.clubtickets.com/en/ibiza-clubs-tickets",
      "https://www.ibiza-spotlight.com/events/club-nights",
      "https://www.ibiza-spotlight.com/events/calendar"
    ];

    console.log(`Preparing to scrape ${urlsToScrape.length} URLs${forceUpdate ? ' (force update)' : ''}`);
    
    const scrapedEvents = [];
    
    for (const url of urlsToScrape) {
      console.log(`Scraping ${url}`);
      
      try {
        // Make API request to Jigsaw according to documentation
        const response = await fetch("https://api.jigsawstack.com/v1/web/ai_scrape", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": jigsawApiKey
          },
          body: JSON.stringify({
            url: url,
            element_prompts: [
              "all upcoming events with date, name, club, price, link, lineup, and music style",
              "extract ticket prices if available", 
              "format dates as ISO strings"
            ]
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Jigsaw API error (${response.status}):`, errorText);
          throw new Error(`Jigsaw API returned ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log("Scraping result:", JSON.stringify(result, null, 2));
        
        // Process the scraped data
        if (result && result.data) {
          // Transform the data into our event format
          const events = processScrapedEvents(result.data, url);
          scrapedEvents.push(...events);
        }
      } catch (scrapeError) {
        console.error(`Error scraping ${url}:`, scrapeError);
      }
    }
    
    console.log(`Scraped ${scrapedEvents.length} events`);
    
    // Insert events into the database
    if (scrapedEvents.length > 0) {
      const { data, error } = await supabase
        .from("events")
        .upsert(scrapedEvents, { 
          onConflict: 'name,date,source',
          ignoreDuplicates: false
        });
      
      if (error) {
        console.error("Error inserting events:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      console.log(`Successfully inserted/updated events in the database`);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraped and processed ${scrapedEvents.length} events`,
        count: scrapedEvents.length,
        events: scrapedEvents,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in scraper function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Process scraped events and transform them into our database format
function processScrapedEvents(data: any, source: string): any[] {
  const events = [];
  
  try {
    // Handle different structures based on what the AI returns
    let eventItems = data;
    
    if (Array.isArray(data)) {
      eventItems = data;
    } else if (data.events && Array.isArray(data.events)) {
      eventItems = data.events;
    } else if (typeof data === 'object') {
      // If it's a single event object
      eventItems = [data];
    }
    
    for (const item of eventItems) {
      // Skip if essential data is missing
      if (!item.name || !item.date) {
        console.log("Skipping incomplete event:", item);
        continue;
      }

      // Parse the date - handle different formats
      let eventDate = null;
      try {
        // If date is already a valid ISO string
        if (item.date && typeof item.date === 'string') {
          const dateObj = new Date(item.date);
          if (!isNaN(dateObj.getTime())) {
            eventDate = dateObj.toISOString();
          }
        }
        
        // If we couldn't parse the date, skip this event
        if (!eventDate) {
          console.log(`Skipping event with invalid date: ${item.name}, ${item.date}`);
          continue;
        }
      } catch (dateError) {
        console.error(`Error parsing date for event ${item.name}:`, dateError);
        continue;
      }

      const event = {
        name: item.name,
        date: eventDate,
        club: item.club || item.venue || null,
        ticket_link: item.link || item.url || item.ticket_link || null,
        music_style: item.music_style || item.genre || null,
        lineup: item.lineup || null,
        description: item.description || null,
        price_range: item.price_range || item.price || null,
        source: source.includes("club-tickets") ? "clubtickets.com" : 
                source.includes("ibiza-spotlight") ? "ibiza-spotlight.com" : 
                "jigsawstack",
      };

      events.push(event);
    }
  } catch (processError) {
    console.error("Error processing scraped events:", processError);
  }
  
  return events;
}
