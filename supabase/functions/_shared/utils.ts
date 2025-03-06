
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export interface Message {
  message: string;
  character?: string;
}

export function handleCorsOptions() {
  return new Response(null, { headers: corsHeaders });
}

export function createErrorResponse(message: string, status = 500) {
  return new Response(
    JSON.stringify({ 
      response: message || "Estoy teniendo problemas para procesar tu solicitud en este momento. Por favor, inténtalo de nuevo más tarde." 
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status 
    }
  );
}

export function createSuccessResponse(response: string) {
  return new Response(
    JSON.stringify({ response }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
