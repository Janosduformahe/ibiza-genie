
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EventScraperProps {
  refetchEvents: () => void;
}

export const EventScraper = ({
  refetchEvents
}: EventScraperProps) => {
  const [isScraperRunning, setIsScraperRunning] = useState(false);
  
  const runScraperNow = async () => {
    if (isScraperRunning) return;
    setIsScraperRunning(true);
    toast({
      title: "Event update started",
      description: "Scraping events from Pacha Ibiza. This may take a moment."
    });
    try {
      console.log("Starting event update process");
      const {
        data,
        error
      } = await supabase.functions.invoke('scrape-jigsaw', {
        body: {
          sources: ['pacha.com']
        }
      });
      if (error) {
        console.error("Error running event update:", error);
        toast({
          title: "Update error",
          description: `Failed to update events: ${error.message || "Unknown error"}`,
          variant: "destructive"
        });
      } else {
        console.log("Event update response:", data);
        if (data.success && data.count > 0) {
          toast({
            title: "Events updated!",
            description: `Successfully updated ${data.count} events from Pacha Ibiza.`
          });
          if (data.results && Array.isArray(data.results)) {
            data.results.forEach(result => {
              const description = result.success ? `Added ${result.inserted || 0} events, updated ${result.updated || 0} events` : `Error: ${result.error}`;
              toast({
                title: result.source,
                description: description,
                variant: result.success ? "default" : "destructive"
              });
            });
          }
        } else {
          toast({
            title: "No new events",
            description: "The calendar is already up to date.",
            variant: "default"
          });
        }
        refetchEvents();
      }
    } catch (err) {
      console.error("Error invoking update function:", err);
      toast({
        title: "Update error",
        description: `Failed to update events: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive"
      });
    } finally {
      setIsScraperRunning(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={runScraperNow}
      disabled={isScraperRunning}
      className="text-white bg-opacity-20 backdrop-filter backdrop-blur-lg border-white/20 hover:bg-white/20"
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isScraperRunning ? 'animate-spin' : ''}`} />
      {isScraperRunning ? 'Actualizando...' : 'Actualizar Eventos de Pacha'}
    </Button>
  );
};
