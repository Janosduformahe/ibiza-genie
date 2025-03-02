
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isWithinInterval, addDays } from "date-fns";
import { toast } from "@/hooks/use-toast";

export interface Event {
  id: string;
  name: string;
  date: string;
  club?: string;
  ticket_link?: string;
  music_style?: string[];
  lineup?: string[];
  price_range?: string;
  description?: string;
  source?: string;
}

export const useEvents = (selectedDate: Date = new Date(), source?: string) => {
  const fetchEvents = async (): Promise<Event[]> => {
    const startOfSelectedMonth = startOfMonth(selectedDate);
    const endOfSelectedMonth = endOfMonth(selectedDate);
    
    // Extend the range a bit to ensure we have events at month boundaries
    const extendedStart = addDays(startOfSelectedMonth, -7);
    const extendedEnd = addDays(endOfSelectedMonth, 7);
    
    const formattedStart = format(extendedStart, "yyyy-MM-dd");
    const formattedEnd = format(extendedEnd, "yyyy-MM-dd");
    
    console.log(`Fetching events for month from ${formattedStart} to ${formattedEnd}`);
    console.log(`Source filter: ${source || 'none (all sources)'}`);
    
    try {
      let query = supabase
        .from("events")
        .select("*")
        .gte("date", formattedStart)
        .lte("date", formattedEnd);
      
      // Add source filter if provided
      if (source) {
        query = query.eq("source", source);
      }
      
      const { data, error } = await query.order("date", { ascending: true });
      
      if (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error fetching events",
          description: error.message,
          variant: "destructive"
        });
        throw new Error(error.message);
      }
      
      console.log(`Found ${data?.length || 0} events in the selected period`);
      if (data && data.length > 0) {
        console.log("Sample event:", data[0]);
      } else {
        // If no events found, suggest to update the calendar
        toast({
          title: "No events found",
          description: "Try clicking 'Update Calendar Now' to get the latest events",
          duration: 5000
        });
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in fetchEvents:", error);
      toast({
        title: "Error fetching events",
        description: "Failed to load events. Please try again later.",
        variant: "destructive"
      });
      return [];
    }
  };

  const getEventsForDay = (events: Event[], day: Date): Event[] => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day.getDate() && 
             eventDate.getMonth() === day.getMonth() && 
             eventDate.getFullYear() === day.getFullYear();
    });
  };

  const getEventsForWeek = (events: Event[], weekStart: Date): Event[] => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return isWithinInterval(eventDate, { start: weekStart, end: weekEnd });
    });
  };

  const getEventsBySource = (events: Event[], source: string): Event[] => {
    return events.filter((event) => event.source === source);
  };
  
  const getUpcomingEvents = (events: Event[], count: number = 5): Event[] => {
    const now = new Date();
    return events
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, count);
  };

  return {
    ...useQuery({
      queryKey: ["events", format(selectedDate, "yyyy-MM"), source],
      queryFn: fetchEvents,
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }),
    getEventsForDay,
    getEventsForWeek,
    getEventsBySource,
    getUpcomingEvents
  };
};
