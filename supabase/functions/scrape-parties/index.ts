import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting connectivity test...');
    
    // Test basic connectivity first
    const testUrl = 'https://www.ibiza-spotlight.com/night/club-dates/2024/03';
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    
    console.log(`Testing connection to: ${testUrl}`);
    
    const response = await fetch(testUrl, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const html = await response.text();
    console.log('HTML length:', html.length);
    console.log('First 500 characters of HTML:', html.substring(0, 500));

    // Check if we're getting a proper HTML response
    if (html.includes('Access denied') || html.includes('blocked') || html.includes('captcha')) {
      console.log('WARNING: Possible blocking detected in response content');
      throw new Error('Access appears to be blocked');
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        status: response.status,
        htmlLength: html.length,
        isBlocked: false,
        message: 'Connection test completed successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error during test:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        isBlocked: true,
        message: 'Connection test failed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});