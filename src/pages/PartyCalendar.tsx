
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CalendarView } from "@/components/events/CalendarView";
import { DailyEvents } from "@/components/events/DailyEvents";
import { useEvents } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { addDays, format, startOfToday } from "date-fns";
import { CalendarDays, PartyPopper } from "lucide-react";

const PartyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const { data: events = [], isLoading, getEventsForDay } = useEvents(selectedDate);
  const dailyEvents = getEventsForDay(events, selectedDate);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
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
        
        <div className="flex justify-end mb-4">
          <Button 
            onClick={jumpToNextParty}
            className="bg-white text-primary hover:bg-white/90"
          >
            <PartyPopper className="mr-2 h-4 w-4" />
            Jump to Next Party
          </Button>
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
                ) : events.slice(0, 5).map((event) => (
                  <li 
                    key={event.id} 
                    className="p-2 text-sm rounded hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleDateSelect(new Date(event.date))}
                  >
                    <div className="font-medium truncate">{event.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(event.date), "MMM d 'at' h:mm a")}
                    </div>
                  </li>
                ))}
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
