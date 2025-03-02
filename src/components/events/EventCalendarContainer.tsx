
import { useState } from "react";
import { format, startOfToday } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { CalendarView } from "@/components/events/CalendarView";
import { DailyEvents } from "@/components/events/DailyEvents";
import { EventHighlights } from "@/components/events/EventHighlights";
import { EventScheduleInfo } from "@/components/events/EventScheduleInfo";
import { useEvents } from "@/hooks/use-events";

interface EventCalendarContainerProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedSource: string | undefined;
}

export const EventCalendarContainer = ({ 
  selectedDate, 
  setSelectedDate, 
  selectedSource 
}: EventCalendarContainerProps) => {
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

  return {
    events,
    isLoading,
    isError,
    error,
    dailyEvents,
    refetch,
    jumpToNextParty,
    handleDateSelect
  };
};
