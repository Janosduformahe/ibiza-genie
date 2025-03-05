
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

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
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Initialize Supabase client with service role key for admin rights
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    console.log("Starting event update process");
    
    // Get request body parameters if provided
    let { maxPages = 5, sources = null, forceFallback = false } = await req.json();
    
    // Log parameters
    console.log(`Parameters: maxPages=${maxPages}, forceFallback=${forceFallback}`);
    if (sources) console.log(`Sources: ${JSON.stringify(sources)}`);
    
    let results = [];
    let insertedCount = 0;
    let updatedCount = 0;
    let failedCount = 0;
    
    // Check if Pacha scraper is requested
    if (!sources || sources.includes('pacha.com')) {
      try {
        console.log("Running Pacha scraper...");
        const response = await supabase.functions.invoke('scrape-pacha', {
          body: { force: forceFallback }
        });
        
        if (response.error) {
          console.error("Error in Pacha scraper:", response.error);
          results.push({
            success: false,
            source: "pacha.com",
            error: response.error
          });
          failedCount++;
        } else {
          console.log("Pacha scraper succeeded:", response.data);
          
          if (response.data.success) {
            insertedCount += response.data.count || 0;
            results.push({
              success: true,
              source: "pacha.com",
              inserted: response.data.count || 0,
              updated: response.data.updated || 0
            });
          } else {
            results.push({
              success: false,
              source: "pacha.com",
              error: response.data.error || "Unknown error"
            });
            failedCount++;
          }
        }
      } catch (error) {
        console.error("Error invoking Pacha scraper:", error);
        results.push({
          success: false,
          source: "pacha.com",
          error: error.message
        });
        failedCount++;
      }
    }
    
    // Return success with statistics
    return new Response(
      JSON.stringify({
        success: true,
        count: insertedCount + updatedCount,
        results: results,
        message: "Event data updated successfully"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error in scrape-jigsaw function:', error);
    
    return new Response(
      JSON.stringify({
        success: false, 
        error: error.message,
        results: [{
          success: false,
          source: "scraper",
          error: `Scraper error: ${error.message}`
        }]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
