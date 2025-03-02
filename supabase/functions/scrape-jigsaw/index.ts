
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.37.0";
import { JigsawStack } from "https://esm.sh/jigsawstack@latest";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const jigsawApiKey = Deno.env.get("JIGSAW") || ""; // Updated to use the correct secret name

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

    // Initialize JigsawStack with API key
    const jigsawstack = JigsawStack({
      apiKey: jigsawApiKey,
    });

    // URLs to scrape
    const urlsToScrape = [
      "https://www.club-tickets.de/de/tickets.htm",
    ];

    console.log(`Preparing to scrape ${urlsToScrape.length} URLs`);
    
    const scrapedEvents = [];
    
    for (const url of urlsToScrape) {
      console.log(`Scraping ${url}`);
      
      try {
        const result = await jigsawstack.web.ai_scrape({
          url: url,
          element_prompts: ["all upcoming events with date, name, club, link"],
        });
        
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
        source: source,
      };

      events.push(event);
    }
  } catch (processError) {
    console.error("Error processing scraped events:", processError);
  }
  
  return events;
}
