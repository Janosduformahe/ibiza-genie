import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CalendarView } from "@/components/events/CalendarView";
import { DailyEvents } from "@/components/events/DailyEvents";
import { useEvents } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { addDays, format, startOfToday } from "date-fns";
import { CalendarDays, PartyPopper, RefreshCw, Filter, AlertCircle, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AddEventForm } from "@/components/events/AddEventForm";

const PartyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [isScrapingEvents, setIsScrapingEvents] = useState(false);
  const [isScrapingJigsaw, setIsScrapingJigsaw] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | undefined>(undefined);
  const { data: events = [], isLoading, getEventsForDay, refetch, isError, error } = useEvents(selectedDate, selectedSource);
  const dailyEvents = getEventsForDay(events, selectedDate);
  const [lastScrapingError, setLastScrapingError] = useState<string | null>(null);

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
        description: "Try selecting a different month to find more events or adding an event manually",
        variant: "destructive",
      });
    }
  };

  const scrapeEvents = async () => {
    try {
      setIsScrapingEvents(true);
      setLastScrapingError(null);
      
      toast({
        title: "Adding Club Tickets events",
        description: "This may take a few moments...",
      });
      
      const { data, error } = await supabase.functions.invoke('scrape-club-tickets', {
        body: { force: true }
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Scraper response:", data);
      
      // Refetch events to display the new ones
      await refetch();
      
      toast({
        title: "Events added successfully",
        description: data.message || `Found ${data.count || 0} events from Club Tickets`,
      });
    } catch (error) {
      console.error("Error scraping events:", error);
      setLastScrapingError(error.message || "An unexpected error occurred");
      toast({
        title: "Error adding events",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsScrapingEvents(false);
    }
  };

  const scrapeWithJigsaw = async () => {
    try {
      setIsScrapingJigsaw(true);
      setLastScrapingError(null);
      
      toast({
        title: "Scraping events with Jigsaw AI",
        description: "This may take a few moments...",
      });
      
      const { data, error } = await supabase.functions.invoke('scrape-jigsaw', {
        body: { force: true }
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Jigsaw scraper response:", data);
      
      // Refetch events to display the new ones
      await refetch();
      
      toast({
        title: "Events added successfully",
        description: data.message || `Found ${data.count || 0} events using Jigsaw AI`,
      });
    } catch (error) {
      console.error("Error scraping events with Jigsaw:", error);
      setLastScrapingError(error.message || "An unexpected error occurred");
      toast({
        title: "Error adding events",
        description: error.message || "An unexpected error occurred with Jigsaw scraping",
        variant: "destructive",
      });
    } finally {
      setIsScrapingJigsaw(false);
    }
  };

  const handleEventAdded = async () => {
    await refetch();
    toast({
      title: "Events updated",
      description: "Calendar has been refreshed with the latest events",
    });
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
        
        {lastScrapingError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error scraping events</AlertTitle>
            <AlertDescription>
              {lastScrapingError}
            </AlertDescription>
          </Alert>
        )}
        
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
                <SelectItem value="jigsawstack">Jigsaw AI</SelectItem>
                <SelectItem value="manual">Manual entries</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <AddEventForm onEventAdded={handleEventAdded} />
            
            <Button 
              onClick={scrapeEvents}
              disabled={isScrapingEvents || isScrapingJigsaw}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isScrapingEvents ? 'animate-spin' : ''}`} />
              {isScrapingEvents ? "Adding..." : "Add Club Tickets Events"}
            </Button>
            
            <Button 
              onClick={scrapeWithJigsaw}
              disabled={isScrapingEvents || isScrapingJigsaw}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              <Globe className={`mr-2 h-4 w-4 ${isScrapingJigsaw ? 'animate-spin' : ''}`} />
              {isScrapingJigsaw ? "Scraping..." : "Scrape with Jigsaw AI"}
            </Button>
            
            <Button 
              onClick={jumpToNextParty}
              className="bg-white text-primary hover:bg-white/90"
            >
              <PartyPopper className="mr-2 h-4 w-4" />
              Jump to Next Party
            </Button>
          </div>
        </div>
        
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
                    No events found. Try adding events manually or use the scraping buttons above.
                  </li>
                )}
              </ul>
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
      </div>
    </div>
  );
};

export default PartyCalendar;
