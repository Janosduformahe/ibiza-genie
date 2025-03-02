
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CalendarView } from "@/components/events/CalendarView";
import { DailyEvents } from "@/components/events/DailyEvents";
import { useEvents } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { format, startOfToday } from "date-fns";
import { CalendarDays, PartyPopper, Filter, Globe, Clock, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const PartyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedSource, setSelectedSource] = useState<string | undefined>(undefined);
  const [isScraperRunning, setIsScraperRunning] = useState(false);
  const { data: events = [], isLoading, getEventsForDay, refetch, isError, error } = useEvents(selectedDate, selectedSource);
  const dailyEvents = getEventsForDay(events, selectedDate);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSourceChange = (value: string) => {
    setSelectedSource(value === "all" ? undefined : value);
  };

  const jumpToNextParty = () => {
    const upcomingEvent = events.find(event => new Date(event.date) >= startOfToday());
    
    if (upcomingEvent) {
      const nextPartyDate = new Date(upcomingEvent.date);
      setSelectedDate(nextPartyDate);
      toast({
        title: "Next party found!",
        description: `Showing events for ${format(nextPartyDate, "EEEE, MMMM do")}`,
      });
    } else {
      toast({
        title: "No upcoming parties found",
        description: "Try selecting a different month to find more events",
        variant: "destructive",
      });
    }
  };

  const runScraperNow = async () => {
    if (isScraperRunning) return;
    
    setIsScraperRunning(true);
    toast({
      title: "Scraper started",
      description: "Fetching events for the whole year. This may take a few minutes.",
    });
    
    try {
      console.log("Starting scraper with maxPages=30");
      
      const { data, error } = await supabase.functions.invoke('scrape-jigsaw', {
        body: { maxPages: 30 }
      });
      
      if (error) {
        console.error("Error running scraper:", error);
        toast({
          title: "Scraper error",
          description: "Failed to run the event scraper. Please try again later.",
          variant: "destructive",
        });
      } else {
        console.log("Scraper response:", data);
        
        if (data.count === 0) {
          toast({
            title: "No new events found",
            description: "The scraper didn't find any new events to add. Check logs for details.",
            variant: "default",
          });
        } else {
          toast({
            title: "Events scraping completed!",
            description: `Successfully scraped ${data.count || 0} new events.`,
          });
        }
        
        // Show detailed results by source
        if (data.results && Array.isArray(data.results)) {
          data.results.forEach(result => {
            const title = result.success ? `${result.source}: Completed` : `${result.source}: Failed`;
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
        
        // Refresh the events data
        refetch();
      }
    } catch (err) {
      console.error("Error invoking scraper function:", err);
      toast({
        title: "Scraper error",
        description: "Failed to run the event scraper. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsScraperRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-2 mb-6 text-white">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <PartyPopper className="h-8 w-8" />
            Ibiza Party Calendar
          </h1>
          <p className="opacity-90">Find the hottest parties and events happening on the island</p>
        </div>
        
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white" />
            <span className="text-white">Filter by source:</span>
            <Select onValueChange={handleSourceChange} defaultValue="all">
              <SelectTrigger className="w-[180px] bg-white/90">
                <SelectValue placeholder="All sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                <SelectItem value="clubtickets.com">Club Tickets</SelectItem>
                <SelectItem value="ibiza-spotlight.com">Ibiza Spotlight</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={runScraperNow}
              className="bg-white text-primary hover:bg-white/90"
              disabled={isScraperRunning}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isScraperRunning ? 'animate-spin' : ''}`} />
              {isScraperRunning ? "Scraping Events..." : "Run Scraper Now"}
            </Button>
            
            <Button 
              onClick={jumpToNextParty}
              className="bg-white text-primary hover:bg-white/90"
            >
              <PartyPopper className="mr-2 h-4 w-4" />
              Find Next Party
            </Button>
          </div>
        </div>
        
        {/* Add alert for empty calendar with instructions */}
        {events.length === 0 && !isLoading && (
          <Alert className="mb-4 bg-white/90">
            <AlertTitle>No events found</AlertTitle>
            <AlertDescription>
              Click "Run Scraper Now" to fetch events from Ibiza party websites. The scraper will look for upcoming parties and events throughout the whole year.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          <div className="order-2 md:order-1">
            <CalendarView onSelectDate={handleDateSelect} selectedDate={selectedDate} />
            
            <div className="bg-white rounded-lg shadow p-4 mt-4">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Upcoming Highlights
              </h3>
              <ul className="space-y-2">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <li key={i} className="h-8 bg-muted rounded animate-pulse" />
                  ))
                ) : events.length > 0 ? (
                  events.slice(0, 5).map((event) => (
                    <li 
                      key={event.id} 
                      className="p-2 text-sm rounded hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => handleDateSelect(new Date(event.date))}
                    >
                      <div className="font-medium truncate">{event.name}</div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{format(new Date(event.date), "MMM d 'at' h:mm a")}</span>
                        {event.source && <span className="text-primary opacity-70">{event.source}</span>}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">
                    No events found for the selected period.
                  </li>
                )}
              </ul>
            </div>
            
            <div className="bg-white/90 rounded-lg shadow p-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">Auto-Update Schedule</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Our system automatically scrapes event data every 48 hours from various Ibiza venues to keep this calendar up-to-date with the latest parties.
              </p>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <DailyEvents 
              date={selectedDate}
              events={dailyEvents}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-center text-white/80 text-sm">
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span>Events are automatically updated every 48 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyCalendar;
