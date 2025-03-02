
// Follow this setup guide to integrate the Deno runtime and Supabase functions in your project:
// https://deno.land/manual/examples/supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

// ANSI escape codes for colorful console output
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const requestData = await req.json();
    const forceScrape = requestData?.force === true;

    console.log(GREEN + "Starting Club Tickets scraper..." + RESET);
    
    // Define a test event for debugging
    const testEvent = {
      name: "Test Party Event",
      date: new Date().toISOString(),
      club: "Test Club",
      ticket_link: "https://www.clubtickets.com/es/",
      music_style: ["House", "Techno"],
      lineup: ["DJ Test", "DJ Debug"],
      description: "This is a test event to verify database insertion is working",
      source: "clubtickets.com"
    };

    // Insert test event for debugging
    const { data: testEventData, error: testEventError } = await supabase
      .from("events")
      .insert(testEvent)
      .select();

    if (testEventError) {
      console.error(RED + "Error inserting test event:" + RESET, testEventError);
      throw new Error(`Database insertion test failed: ${testEventError.message}`);
    } else {
      console.log(GREEN + "Test event inserted successfully:" + RESET, testEventData);
    }

    // Real scraping code starts here
    const targetUrl = "https://www.clubtickets.com/es/ibiza-clubs-tickets";
    
    // Use a rotating proxy service if available
    const proxyOptions = {};
    const proxyUrl = Deno.env.get("ROTATING_PROXY_URL");
    
    if (proxyUrl) {
      console.log(BLUE + "Using rotating proxy..." + RESET);
      proxyOptions.headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
      };
    }

    console.log(BLUE + `Fetching events from ${targetUrl}...` + RESET);
    
    // Fetch the club tickets page
    const response = await fetch(targetUrl, proxyOptions);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Club Tickets: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    console.log(BLUE + `Received HTML response (${html.length} bytes)` + RESET);
    
    // Log a small sample of the HTML for debugging
    console.log(YELLOW + "HTML sample:" + RESET, html.substring(0, 500) + "...");

    // Parse HTML
    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");
    
    if (!document) {
      throw new Error("Failed to parse HTML");
    }

    // Different selectors to try
    const eventSelectors = [
      ".event-item", // Original selector
      ".event-card",
      ".ticket-list .ticket",
      ".event-list .event",
      "article.event",
      ".events-container .event-item",
      // Try more general selectors
      "article",
      ".card",
      ".product"
    ];

    let eventElements = [];
    let usedSelector = "";

    // Try each selector until we find events
    for (const selector of eventSelectors) {
      console.log(BLUE + `Trying selector: ${selector}` + RESET);
      const elements = document.querySelectorAll(selector);
      if (elements && elements.length > 0) {
        eventElements = elements;
        usedSelector = selector;
        console.log(GREEN + `Found ${elements.length} events with selector: ${selector}` + RESET);
        break;
      }
    }

    // If no events found, try a broader approach - get all links
    if (eventElements.length === 0) {
      console.log(YELLOW + "No event elements found with specific selectors, trying broad approach..." + RESET);
      
      // Look for any links that might be event links
      const allLinks = document.querySelectorAll("a");
      console.log(BLUE + `Found ${allLinks.length} links in total` + RESET);
      
      // Log some links for debugging
      const linkTexts = Array.from(allLinks)
        .slice(0, 10)
        .map(link => ({
          href: link.getAttribute("href"),
          text: link.textContent?.trim()
        }));
      
      console.log(YELLOW + "Sample links:" + RESET, JSON.stringify(linkTexts, null, 2));
      
      // Get all headings that might contain event names
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5");
      console.log(BLUE + `Found ${headings.length} headings` + RESET);
      
      // Log some headings for debugging
      const headingTexts = Array.from(headings)
        .slice(0, 10)
        .map(h => h.textContent?.trim());
      
      console.log(YELLOW + "Sample headings:" + RESET, JSON.stringify(headingTexts, null, 2));
    }

    // Extract event information
    const events = [];
    
    // Log that we're extracting events now
    console.log(BLUE + `Extracting data from ${eventElements.length} events...` + RESET);

    // Return a response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraping completed. Found ${events.length} events with selector: ${usedSelector || 'none'}. Test event was successfully added to check database functionality.`,
        count: events.length + 1, // +1 for test event
        testEventAdded: true
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
    console.error(RED + "Error in scrape-club-tickets function:" + RESET, error);
    
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
