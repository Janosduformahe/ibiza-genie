
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EventScraperProps {
  refetchEvents: () => void;
}

export const EventScraper = ({ refetchEvents }: EventScraperProps) => {
  const [isScraperRunning, setIsScraperRunning] = useState(false);

  const runScraperNow = async () => {
    if (isScraperRunning) return;
    
    setIsScraperRunning(true);
    toast({
      title: "Scraper started",
      description: "Fetching events with IP rotation. This may take a few minutes.",
    });
    
    try {
      console.log("Starting scraper with maxPages=30");
      
      const { data, error } = await supabase.functions.invoke('scrape-jigsaw', {
        body: { 
          maxPages: 30,
          sources: ['clubtickets.com', 'ibiza-spotlight.com']
        }
      });
      
      if (error) {
        console.error("Error running scraper:", error);
        toast({
          title: "Scraper error",
          description: `Failed to run the event scraper: ${error.message || "Unknown error"}`,
          variant: "destructive",
        });
      } else {
        console.log("Scraper response:", data);
        
        if (!data || (data.count !== undefined && data.count === 0)) {
          if (data && data.results && Array.isArray(data.results)) {
            const errorSources = data.results.filter(r => !r.success);
            
            if (errorSources.length > 0) {
              errorSources.forEach(result => {
                toast({
                  title: `${result.source}: Failed`,
                  description: `Error: ${result.error}`,
                  variant: "destructive",
                });
              });
              
              toast({
                title: "Scraping encountered issues",
                description: "Some sources couldn't be scraped. The system tried alternative methods automatically.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "No new events found",
                description: "The scraper ran successfully but didn't find any new events to add.",
                variant: "default",
              });
            }
          } else {
            toast({
              title: "No events found",
              description: "The scraper didn't find any events. This might be because the websites have changed their structure.",
              variant: "default",
            });
          }
        } else {
          toast({
            title: "Events scraping completed!",
            description: `Successfully scraped ${data.count || 0} new events.`,
          });
          
          if (data && data.results && Array.isArray(data.results)) {
            data.results.forEach(result => {
              const title = result.success 
                ? `${result.source}: Completed` 
                : `${result.source}: Failed`;
              
              const description = result.success
                ? `Added ${result.inserted} events, skipped ${result.skipped} duplicates, ${result.invalid || 0} invalid`
                : `Error: ${result.error}`;
                
              toast({
                title: title,
                description: description,
                variant: result.success ? "default" : "destructive",
              });
            });
          }
        }
        
        refetchEvents();
      }
    } catch (err) {
      console.error("Error invoking scraper function:", err);
      toast({
        title: "Scraper error",
        description: `Failed to run the event scraper: ${err instanceof Error ? err.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsScraperRunning(false);
    }
  };

  return (
    <Button 
      onClick={runScraperNow}
      className="bg-white text-primary hover:bg-white/90"
      disabled={isScraperRunning}
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isScraperRunning ? 'animate-spin' : ''}`} />
      {isScraperRunning ? "Scraping Events..." : "Run Scraper Now"}
    </Button>
  );
};
