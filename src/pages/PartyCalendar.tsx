
import { useState } from "react";
import { startOfToday } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { CalendarView } from "@/components/events/CalendarView";
import { DailyEvents } from "@/components/events/DailyEvents";
import { useEvents } from "@/hooks/use-events";
import { CalendarHeader } from "@/components/events/CalendarHeader";
import { EventFilters } from "@/components/events/EventFilters";
import { EventActionButtons } from "@/components/events/EventActionButtons";
import { EventNotifications } from "@/components/events/EventNotifications";
import { EventHighlights } from "@/components/events/EventHighlights";
import { EventScheduleInfo } from "@/components/events/EventScheduleInfo";
import { CalendarFooter } from "@/components/events/CalendarFooter";
import { useLanguage } from "@/hooks/useLanguage";

const PartyCalendar = () => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedSource, setSelectedSource] = useState<string | undefined>(undefined);
  
  const { 
    data: events = [], 
    isLoading, 
    getEventsForDay, 
    refetch, 
    isError, 
    error 
  } = useEvents(selectedDate, selectedSource);
  
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
    } else {
      // Toast notification is handled in the EventCalendar component
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <CalendarHeader />
        
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <EventFilters onSourceChange={handleSourceChange} />
          
          <EventActionButtons 
            onFindNextParty={jumpToNextParty}
            refetchEvents={refetch}
          />
        </div>
        
        <EventNotifications 
          isError={isError}
          error={error}
          events={events}
          isLoading={isLoading}
        />
        
        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          <div className="order-2 md:order-1">
            <CalendarView onSelectDate={handleDateSelect} selectedDate={selectedDate} />
            
            <EventHighlights 
              events={events}
              isLoading={isLoading}
              onSelectDate={handleDateSelect}
            />
            
            <EventScheduleInfo />
          </div>
          
          <div className="order-1 md:order-2">
            <DailyEvents 
              date={selectedDate}
              events={dailyEvents}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        <CalendarFooter />
      </div>
    </div>
  );
};

export default PartyCalendar;
