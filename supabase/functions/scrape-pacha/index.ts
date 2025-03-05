
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log("Starting Pacha Ibiza scraper...");
    
    // Parse request body
    const requestData = await req.json();
    const forceScrape = requestData?.force === true;
    
    // Get the current date in ISO format for comparing with existing events
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString();
    
    // Define the URL for Pacha Ibiza events
    const targetUrl = "https://pacha.com/es/events/";
    console.log(`Fetching Pacha events from ${targetUrl}...`);
    
    // Configure headers to appear as a regular browser
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    // Fetch the Pacha events page
    const response = await fetch(targetUrl, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pacha events: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    console.log(`Received HTML response (${html.length} bytes)`);
    
    // Parse the HTML
    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");
    
    if (!document) {
      throw new Error("Failed to parse HTML document");
    }
    
    // Find all event elements on the page
    // This selector may need to be adjusted based on Pacha's actual HTML structure
    const eventElements = document.querySelectorAll(".event-card, .event-item, .event-container, article.event");
    console.log(`Found ${eventElements.length} event elements`);
    
    if (eventElements.length === 0) {
      // Try alternative selectors if main one fails
      console.log("No events found with primary selector, trying alternatives...");
      const alternativeElements = document.querySelectorAll("article, .pacha-event, .event, [data-event]");
      console.log(`Found ${alternativeElements.length} events with alternative selectors`);
      
      if (alternativeElements.length === 0) {
        // Log a portion of the HTML to help debug selector issues
        console.log("HTML sample:", html.substring(0, 1000) + "...");
        console.log("HTML structure may have changed. Selector update needed.");
      }
    }
    
    const processedEvents = [];
    let addedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    // Process each event
    for (const element of eventElements) {
      try {
        // Extract event data - selectors may need adjustment based on actual HTML structure
        const name = element.querySelector("h3, h2, .event-name, .title")?.textContent?.trim();
        const dateElement = element.querySelector(".date, .event-date, time");
        let date = dateElement?.getAttribute("datetime") || dateElement?.textContent?.trim();
        
        // Additional elements to extract
        const descriptionElement = element.querySelector(".description, .event-description, .content");
        const linkElement = element.querySelector("a.event-link, a.more-info, a.ticket-link");
        const imageElement = element.querySelector("img.event-image, .event-img img, .thumbnail img");
        
        // Format and clean extracted data
        const description = descriptionElement?.textContent?.trim();
        const ticketLink = linkElement?.getAttribute("href");
        const imageUrl = imageElement?.getAttribute("src");
        
        // Skip if essential data is missing
        if (!name || !date) {
          console.log("Skipping event due to missing name or date");
          continue;
        }
        
        // Convert date string to ISO format
        let eventDate = new Date(date);
        if (isNaN(eventDate.getTime())) {
          // If date parsing fails, try alternative formats or use regex
          console.log(`Could not parse date: ${date} for event: ${name}`);
          
          // Attempt to extract date using regex (example: "25 JUN 2023")
          const dateRegex = /(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/;
          const match = date.match(dateRegex);
          
          if (match) {
            const months = {
              "JAN": 0, "FEB": 1, "MAR": 2, "APR": 3, "ABR": 3, 
              "MAY": 4, "JUN": 5, "JUL": 6, "AUG": 7, "AGO": 7, 
              "SEP": 8, "OCT": 9, "NOV": 10, "DEC": 11, "DIC": 11
            };
            
            const day = parseInt(match[1]);
            const month = months[match[2].toUpperCase()];
            const year = parseInt(match[3]);
            
            if (!isNaN(day) && month !== undefined && !isNaN(year)) {
              eventDate = new Date(year, month, day);
            } else {
              // If all parsing attempts fail, use current date plus 7 days as fallback
              eventDate = new Date();
              eventDate.setDate(eventDate.getDate() + 7);
              console.log(`Using fallback date for event: ${name}`);
            }
          } else {
            // If regex also fails, use current date plus 7 days
            eventDate = new Date();
            eventDate.setDate(eventDate.getDate() + 7);
            console.log(`Using fallback date for event: ${name}`);
          }
        }
        
        const eventDateISO = eventDate.toISOString();
        
        // Create event object
        const event = {
          name: name,
          date: eventDateISO,
          club: "Pacha Ibiza",
          description: description || `${name} at Pacha Ibiza`,
          ticket_link: ticketLink ? new URL(ticketLink, targetUrl).href : null,
          music_style: ["Electronic", "House"], // Default music styles for Pacha
          source: "pacha.com"
        };
        
        processedEvents.push(event);
        
        // Check if event already exists in database
        const { data: existingEvents, error: queryError } = await supabase
          .from("events")
          .select("id")
          .eq("name", event.name)
          .eq("club", event.club)
          .eq("date", event.date);
        
        if (queryError) {
          console.error("Database query error:", queryError);
          errorCount++;
          continue;
        }
        
        if (existingEvents && existingEvents.length > 0) {
          // Update existing event
          const { error: updateError } = await supabase
            .from("events")
            .update({
              description: event.description,
              ticket_link: event.ticket_link,
              music_style: event.music_style,
              source: event.source
            })
            .eq("id", existingEvents[0].id);
          
          if (updateError) {
            console.error("Error updating event:", updateError);
            errorCount++;
          } else {
            updatedCount++;
            console.log(`Updated event: ${event.name}`);
          }
        } else {
          // Insert new event
          const { error: insertError } = await supabase
            .from("events")
            .insert([event]);
          
          if (insertError) {
            console.error("Error inserting event:", insertError);
            errorCount++;
          } else {
            addedCount++;
            console.log(`Added new event: ${event.name}`);
          }
        }
      } catch (error) {
        console.error("Error processing event:", error);
        errorCount++;
      }
    }
    
    // Return the results
    return new Response(
      JSON.stringify({
        success: true,
        message: `Pacha events updated: ${addedCount} added, ${updatedCount} updated, ${errorCount} errors`,
        count: addedCount + updatedCount,
        events: processedEvents
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in scrape-pacha function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
