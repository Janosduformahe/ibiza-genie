import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { getWeeks, constructUrl } from "./utils/date-utils.ts"
import { fetchWithRetry } from "./utils/http-utils.ts"
import { extractEventData } from "./utils/parser-utils.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Fetch events for each week with increased delays
    for (const week of weeks) {
      const url = constructUrl(week.start, week.end);
      console.log(`Processing week from ${week.start} to ${week.end}`);
      console.log(`URL: ${url}`);
      
      try {
        const html = await fetchWithRetry(url);
        const weekEvents = await extractEventData(html);
        events.push(...weekEvents);

        console.log(`Found ${weekEvents.length} events for current week`);
        
        // Significant delay between requests
        const delay = 10000 + Math.random() * 5000; // 10-15 seconds
        console.log(`Waiting ${delay}ms before next request...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
      } catch (error) {
        console.error(`Error processing week:`, error);
        continue;
      }
    }

    console.log(`Total events found: ${events.length}`);

    // Insert events into database
    let successCount = 0;
    for (const event of events) {
      const { error } = await supabase
        .from('events')
        .upsert(event, { onConflict: 'name,date' });

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