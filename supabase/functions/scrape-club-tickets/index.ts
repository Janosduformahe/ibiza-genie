
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

interface ProxyProvider {
  getProxy: () => Promise<string>;
}

class RotatingProxyProvider implements ProxyProvider {
  private proxies: string[] = [
    // Free rotating proxies (for demonstration)
    // In production, you would use paid proxy services like Bright Data, Oxylabs, etc.
    "https://proxy1.example.com",
    "https://proxy2.example.com",
    "https://proxy3.example.com",
  ];
  private currentIndex = 0;

  async getProxy(): Promise<string> {
    // Simple rotation mechanism
    const proxy = this.proxies[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
    return proxy;
  }
}

// Initialize proxy provider
const proxyProvider = new RotatingProxyProvider();

// Function to fetch with proxy (simplified for demonstration)
async function fetchWithProxy(url: string): Promise<Response> {
  // In a real implementation, you would use the proxy
  // For now, just doing a direct fetch to not complicate things
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error("Error fetching with direct request:", error);
    throw error;
  }
}

// Parse events from Club Tickets
async function scrapeClubTicketsEvents() {
  try {
    const baseUrl = "https://www.clubtickets.com/es/";
    const response = await fetchWithProxy(baseUrl);
    const html = await response.text();
    
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc) throw new Error("Failed to parse HTML");
    
    const events = [];
    
    // Find event containers
    const eventElements = doc.querySelectorAll(".eventoContent");
    
    for (const eventEl of eventElements) {
      try {
        // Extract event details
        const nameEl = eventEl.querySelector(".eventoInfo h2");
        const name = nameEl ? nameEl.textContent.trim() : "Unknown Event";
        
        const dateEl = eventEl.querySelector(".eventoInfo .eventoFecha");
        let dateStr = dateEl ? dateEl.textContent.trim() : "";
        
        // Parse the date (format: "Viernes 7 Junio 2024")
        const dateParts = dateStr.split(" ");
        if (dateParts.length >= 4) {
          const day = dateParts[1];
          const month = parseSpanishMonth(dateParts[2]);
          const year = dateParts[3];
          
          // Create a date object - assuming events start at 23:00 if not specified
          const date = new Date(`${year}-${month}-${day}T23:00:00`);
          
          // Get ticket link
          const linkEl = eventEl.querySelector("a.eventoTickets");
          const ticketLink = linkEl ? `${baseUrl}${linkEl.getAttribute("href")}` : null;
          
          // Get venue/club
          const clubEl = eventEl.querySelector(".eventoInfo .eventoClub");
          const club = clubEl ? clubEl.textContent.trim() : null;
          
          // Get lineup (if available)
          const lineupEl = eventEl.querySelector(".eventoInfo .eventoArtistas");
          let lineup = [];
          if (lineupEl) {
            const lineupText = lineupEl.textContent.trim();
            lineup = lineupText.split(",").map(artist => artist.trim()).filter(Boolean);
          }
          
          // Get image for description preview
          const imgEl = eventEl.querySelector("img");
          const imgSrc = imgEl ? imgEl.getAttribute("src") : null;
          
          // Add event to the list
          events.push({
            name,
            date: date.toISOString(),
            club,
            ticket_link: ticketLink,
            lineup,
            description: `Event at ${club || "Ibiza"}. Book your tickets now!`,
            source: "clubtickets.com"
          });
        }
      } catch (eventError) {
        console.error("Error processing event:", eventError);
        // Continue with next event
      }
    }
    
    return events;
  } catch (error) {
    console.error("Error scraping Club Tickets:", error);
    throw error;
  }
}

// Helper function to parse Spanish month names to numbers
function parseSpanishMonth(month: string): string {
  const months: { [key: string]: string } = {
    "enero": "01",
    "febrero": "02", 
    "marzo": "03",
    "abril": "04",
    "mayo": "05",
    "junio": "06",
    "julio": "07",
    "agosto": "08",
    "septiembre": "09",
    "octubre": "10",
    "noviembre": "11",
    "diciembre": "12"
  };
  
  // Convert to lowercase for case-insensitive matching
  const lowercaseMonth = month.toLowerCase();
  return months[lowercaseMonth] || "01"; // Default to January if not found
}

// Save events to Supabase
async function saveEvents(events: any[]) {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const uniqueEvents = [];
    
    // Check for existing events to avoid duplicates
    for (const event of events) {
      const { data, error } = await supabase
        .from("events")
        .select("id")
        .eq("name", event.name)
        .eq("date", event.date)
        .eq("club", event.club || "")
        .single();
      
      if (error && error.code !== "PGRST116") { // PGRST116 is "No rows returned"
        console.error("Error checking for duplicate event:", error);
        continue;
      }
      
      if (!data) {
        uniqueEvents.push(event);
      }
    }
    
    console.log(`Found ${uniqueEvents.length} new events to add`);
    
    if (uniqueEvents.length === 0) {
      return { count: 0, message: "No new events found" };
    }
    
    // Insert new events
    const { data, error } = await supabase
      .from("events")
      .insert(uniqueEvents)
      .select();
    
    if (error) {
      console.error("Error inserting events:", error);
      throw error;
    }
    
    return { count: data?.length || 0, message: "Events added successfully" };
  } catch (error) {
    console.error("Error saving events:", error);
    throw error;
  }
}

// Main handler for the edge function
Deno.serve(async (req) => {
  try {
    // CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Content-Type": "application/json",
    };
    
    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers });
    }
    
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers }
      );
    }
    
    // Parse request body
    const body = await req.json();
    const force = body?.force === true;
    
    // Scrape events
    console.log("Starting to scrape Club Tickets events...");
    const events = await scrapeClubTicketsEvents();
    console.log(`Found ${events.length} events from Club Tickets`);
    
    // Save events to database
    const result = await saveEvents(events);
    
    return new Response(
      JSON.stringify({ success: true, ...result }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error in edge function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
