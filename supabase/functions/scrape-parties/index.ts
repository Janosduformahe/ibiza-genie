import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rotating User-Agents to look more like real browsers
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
];

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function getWeeks(startDate: Date, endDate: Date) {
  const weeks = [];
  let currentDate = new Date(startDate);
  
  // Adjust to Monday
  while (currentDate.getDay() !== 1) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  while (currentDate <= endDate) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    weeks.push({
      start: weekStart,
      end: weekEnd > endDate ? endDate : weekEnd
    });

    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeks;
}

function formatDate(date: Date) {
  return [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    date.getFullYear()
  ].join('/');
}

function getTargetMonth(date: Date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function constructUrl(weekStart: Date, weekEnd: Date) {
  const baseUrl = "https://www.ibiza-spotlight.es/night/events";
  const month = getTargetMonth(weekEnd);
  const start = formatDate(weekStart);
  const end = formatDate(weekEnd);

  // If week starts and ends in same month, use base URL
  // Otherwise, use daterange parameter
  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${baseUrl}/${month}`;
  } else {
    return `${baseUrl}/${month}?daterange=${start}-${end}`;
  }
}

async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}

async function extractEventData(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const events = [];

  if (!doc) {
    console.error('Failed to parse HTML');
    return events;
  }

  // Log the HTML structure to debug
  console.log('HTML Structure:', html.substring(0, 500));

  const eventElements = doc.querySelectorAll('.event-item');
  console.log(`Found ${eventElements.length} event elements`);
  
  for (const element of eventElements) {
    try {
      const name = element.querySelector('.event-title')?.textContent?.trim();
      const dateText = element.querySelector('.event-date')?.textContent?.trim();
      const club = element.querySelector('.event-venue')?.textContent?.trim();
      const ticketLink = element.querySelector('.ticket-link')?.getAttribute('href');
      const priceText = element.querySelector('.event-price')?.textContent?.trim();
      const description = element.querySelector('.event-description')?.textContent?.trim();
      
      const musicStyleElements = element.querySelectorAll('.music-tag');
      const musicStyle = Array.from(musicStyleElements)
        .map(el => el.textContent?.trim())
        .filter(Boolean);
      
      const lineupElements = element.querySelectorAll('.artist-name');
      const lineup = Array.from(lineupElements)
        .map(el => el.textContent?.trim())
        .filter(Boolean);
      
      if (name && dateText) {
        const date = new Date(dateText);
        events.push({
          name,
          date: date.toISOString(),
          club,
          ticket_link: ticketLink,
          price_range: priceText,
          music_style: musicStyle,
          description,
          lineup
        });
        console.log(`Successfully extracted event: ${name}`);
      }
    } catch (error) {
      console.error('Error extracting event data:', error);
    }
  }

  return events;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting party scraping process...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get next 6 months of events
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);
    
    console.log(`Scraping events from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    const weeks = getWeeks(startDate, endDate);
    const events = [];

    // Fetch events for each week
    for (const week of weeks) {
      const url = constructUrl(week.start, week.end);
      console.log(`Fetching events from: ${url}`);
      
      try {
        const html = await fetchWithRetry(url);
        const weekEvents = await extractEventData(html);
        events.push(...weekEvents);

        console.log(`Found ${weekEvents.length} events for week ${formatDate(week.start)} to ${formatDate(week.end)}`);
        
        // Add significant delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 5000));
        
      } catch (error) {
        console.error(`Error fetching week ${formatDate(week.start)}:`, error);
        // Continue with next week instead of stopping completely
        continue;
      }
    }

    console.log(`Total events found: ${events.length}`);

    // Insert events into the database
    let successCount = 0;
    for (const event of events) {
      const { error } = await supabase
        .from('events')
        .upsert(
          {
            name: event.name,
            date: event.date,
            club: event.club,
            ticket_link: event.ticket_link,
            price_range: event.price_range,
            music_style: event.music_style,
            description: event.description,
            lineup: event.lineup
          },
          {
            onConflict: 'name,date'
          }
        );

      if (error) {
        console.error('Error inserting event:', error);
      } else {
        successCount++;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${successCount} out of ${events.length} events` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});