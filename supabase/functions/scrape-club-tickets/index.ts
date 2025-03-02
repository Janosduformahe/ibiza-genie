
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interfaces
interface Event {
  name: string;
  date: string;
  club?: string;
  ticket_link?: string;
  price_range?: string;
  music_style?: string[];
  description?: string;
  lineup?: string[];
}

// Function to get a random proxy from the list
function getRandomProxy(proxyList: string[]): string {
  return proxyList[Math.floor(Math.random() * proxyList.length)];
}

// Function to retry a fetch with different proxies
async function fetchWithRetry(url: string, proxyList: string[], maxRetries = 3): Promise<Response> {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const proxy = getRandomProxy(proxyList);
      console.log(`Attempt ${attempt + 1} using proxy: ${proxy}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'X-Proxy-URL': proxy
        }
      });
      
      if (response.ok) {
        return response;
      }
      
      console.log(`Attempt ${attempt + 1} failed with status: ${response.status}`);
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed with error:`, error);
    }
  }
  
  throw lastError || new Error('All fetch attempts failed');
}

// Function to scrape events from Club Tickets
async function scrapeClubTickets(proxyList: string[]): Promise<Event[]> {
  const events: Event[] = [];
  
  try {
    console.log("Starting to scrape Club Tickets...");
    
    // Pages to scrape (main events page and pagination)
    const urls = [
      "https://www.clubtickets.com/es/",
      "https://www.clubtickets.com/es/?pag=2",
      "https://www.clubtickets.com/es/?pag=3"
    ];
    
    for (const url of urls) {
      console.log(`Scraping URL: ${url}`);
      
      const response = await fetchWithRetry(url, proxyList);
      const htmlText = await response.text();
      
      // Parse the HTML
      const parser = new DOMParser();
      const document = parser.parseFromString(htmlText, "text/html");
      
      if (!document) {
        console.error("Failed to parse HTML");
        continue;
      }
      
      // Find event elements (adapt selectors based on the actual website structure)
      // These selectors are examples and need to be adjusted
      const eventElements = document.querySelectorAll(".event-card, .party-item, .event-listing");
      
      console.log(`Found ${eventElements.length} events on ${url}`);
      
      for (const element of eventElements) {
        try {
          // Extract data (adjust selectors based on actual HTML structure)
          const name = element.querySelector(".event-title, h2, .title")?.textContent?.trim();
          const dateText = element.querySelector(".event-date, .date, time")?.textContent?.trim();
          const club = element.querySelector(".venue, .location, .club-name")?.textContent?.trim();
          const ticketLink = element.querySelector("a.ticket-link, a.buy-tickets")?.getAttribute("href");
          const description = element.querySelector(".description, .event-description")?.textContent?.trim();
          
          // Music styles might be in tags or categories
          const styleElements = element.querySelectorAll(".music-style, .genre, .tag");
          const musicStyles = Array.from(styleElements).map(el => el.textContent?.trim()).filter(Boolean) as string[];
          
          // Lineup might be listed separately
          const lineupElements = element.querySelectorAll(".artist, .dj, .performer");
          const lineup = Array.from(lineupElements).map(el => el.textContent?.trim()).filter(Boolean) as string[];
          
          // Price range
          const priceText = element.querySelector(".price, .ticket-price")?.textContent?.trim();
          
          if (name && dateText) {
            // Convert date format
            let eventDate = new Date();
            try {
              // Try to parse the date (adjust format based on website)
              const dateMatch = dateText.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
              if (dateMatch) {
                // Format: DD/MM/YYYY
                eventDate = new Date(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`);
              } else {
                // Alternative format parsing if needed
                console.log(`Date format not recognized: ${dateText}`);
              }
            } catch (error) {
              console.error(`Error parsing date ${dateText}:`, error);
            }
            
            // Create event object
            const event: Event = {
              name,
              date: eventDate.toISOString(),
              club,
              ticket_link: ticketLink ? new URL(ticketLink, "https://www.clubtickets.com").href : undefined,
              price_range: priceText,
              music_style: musicStyles.length > 0 ? musicStyles : undefined,
              description,
              lineup: lineup.length > 0 ? lineup : undefined
            };
            
            events.push(event);
            console.log(`Extracted event: ${name}`);
          }
        } catch (error) {
          console.error("Error extracting event data:", error);
        }
      }
    }
    
    console.log(`Total events scraped: ${events.length}`);
    return events;
  } catch (error) {
    console.error("Error scraping Club Tickets:", error);
    throw error;
  }
}

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get request body
    const reqBody = await req.json();
    const { force = false } = reqBody;
    
    // List of proxy servers (these are placeholders - you'll need real proxy servers)
    const proxyList = [
      "http://proxy1.example.com:8080",
      "http://proxy2.example.com:8080",
      "http://proxy3.example.com:8080"
    ];
    
    console.log("Starting scraping process...");
    const events = await scrapeClubTickets(proxyList);
    
    // Store events in the database
    if (events.length > 0) {
      console.log(`Storing ${events.length} events in the database...`);
      
      if (force) {
        // If force flag is true, clear existing events first
        const { error: deleteError } = await supabase
          .from("events")
          .delete()
          .eq("source", "clubtickets");
        
        if (deleteError) {
          console.error("Error deleting existing events:", deleteError);
        }
      }
      
      // Insert new events
      for (const event of events) {
        const { error } = await supabase
          .from("events")
          .upsert({
            ...event,
            source: "clubtickets"
          }, {
            onConflict: "name,date"
          });
        
        if (error) {
          console.error(`Error inserting event ${event.name}:`, error);
        }
      }
      
      return new Response(JSON.stringify({ success: true, count: events.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: "No events found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404
      });
    }
  } catch (error) {
    console.error("Error in scrape function:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});
