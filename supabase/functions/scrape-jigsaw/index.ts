
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

const JIGSAW_API_KEY = Deno.env.get("JIGSAW") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Function to validate a date string
function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// Function to ensure all required event fields are present
function validateEvent(event: any): { valid: boolean; reason?: string } {
  if (!event.name || typeof event.name !== 'string' || event.name.trim() === '') {
    return { valid: false, reason: 'Missing or invalid name' };
  }

  if (!event.date || !isValidDate(event.date)) {
    return { valid: false, reason: 'Missing or invalid date' };
  }

  return { valid: true };
}

// Process the events from Jigsaw API
async function processEvents(events: any[], source: string) {
  console.log(`Processing ${events.length} events from ${source}`);
  
  let inserted = 0;
  let skipped = 0;
  let invalid = 0;

  for (const event of events) {
    try {
      // Check if the event has valid data
      const validation = validateEvent(event);
      if (!validation.valid) {
        console.log(`Invalid event: ${JSON.stringify(event)} - Reason: ${validation.reason}`);
        invalid++;
        continue;
      }

      // Check if we already have this event in the database
      const { data: existingEvents } = await supabase
        .from('events')
        .select('id')
        .eq('name', event.name)
        .eq('date', new Date(event.date).toISOString())
        .eq('source', source);

      if (existingEvents && existingEvents.length > 0) {
        console.log(`Event already exists: ${event.name} on ${event.date}`);
        skipped++;
        continue;
      }

      // Insert the event
      const { error } = await supabase.from('events').insert({
        name: event.name,
        date: new Date(event.date).toISOString(),
        club: event.club || null,
        ticket_link: event.ticket_link || null,
        price_range: event.price_range || null,
        music_style: Array.isArray(event.music_style) ? event.music_style : null,
        description: event.description || null,
        lineup: Array.isArray(event.lineup) ? event.lineup : null,
        source: source
      });

      if (error) {
        console.error(`Error inserting event: ${error.message}`, event);
        throw error;
      }

      inserted++;
      console.log(`Inserted event: ${event.name}`);
    } catch (error) {
      console.error(`Error processing event: ${error.message}`);
      throw error;
    }
  }

  return { inserted, skipped, invalid };
}

// Scrape a website using Jigsaw
async function scrapeWebsite(url: string, maxPages: number = 10) {
  console.log(`Scraping ${url} with maxPages=${maxPages}`);

  try {
    const domain = new URL(url).hostname;
    
    // Call the Jigsaw API for scraping
    const response = await fetch("https://api.jigsawstack.com/v1/scrape/website", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": JIGSAW_API_KEY
      },
      body: JSON.stringify({
        url: url,
        maxPages: maxPages,
        maxNavigation: maxPages,
        scrapeData: [
          {
            dataPath: "events",
            selector: ".event-item, .event, article, .party-event, .event-card, .clubEvent",
            extract: [
              { key: "name", selector: ".event-title, .title, h2, h3, .event-name", attr: "text" },
              { key: "date", selector: ".event-date, .date, time, .event-time", attr: "text" },
              { key: "club", selector: ".event-venue, .venue, .location, .event-location", attr: "text" },
              { key: "ticket_link", selector: ".ticket-link, .tickets a, .buy-tickets, a.btn", attr: "href" },
              { key: "price_range", selector: ".event-price, .price, .ticket-price", attr: "text" },
              { key: "description", selector: ".event-description, .description, .details, .event-details", attr: "text" }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to scrape ${url}: ${response.status} ${response.statusText}`, errorText);
      return { success: false, error: `API error: ${response.status} ${response.statusText}` };
    }

    const result = await response.json();

    if (result.data && result.data.events && Array.isArray(result.data.events)) {
      const stats = await processEvents(result.data.events, domain);
      return { success: true, source: domain, ...stats };
    } else {
      console.log(`No events found from ${url}`);
      return { success: true, source: domain, inserted: 0, skipped: 0, invalid: 0 };
    }
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return { success: false, source: new URL(url).hostname, error: error.message || 'Unknown error' };
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body = await req.json();
    const maxPages = body.maxPages || 10;
    const sources = body.sources || [
      'https://www.clubtickets.com/ibiza',
      'https://www.ibiza-spotlight.com/nightclubs/calendar'
    ];

    console.log(`Starting scraper with maxPages=${maxPages}`);
    console.log(`Scraping sources: ${JSON.stringify(sources)}`);

    if (!JIGSAW_API_KEY) {
      console.error("JIGSAW API key not found");
      return new Response(
        JSON.stringify({ error: "Missing API key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process each source
    const results = [];
    for (const source of sources) {
      // Add https:// if needed
      const url = source.startsWith('http') ? source : `https://www.${source}`;
      const result = await scrapeWebsite(url, maxPages);
      results.push(result);
    }

    // Calculate total count
    const totalCount = results.reduce((total, result) => {
      return total + (result.success ? (result.inserted || 0) : 0);
    }, 0);

    return new Response(
      JSON.stringify({ 
        count: totalCount,
        results: results
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in scrape-jigsaw function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
