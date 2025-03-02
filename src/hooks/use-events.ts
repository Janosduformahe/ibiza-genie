
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

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
}

export const useEvents = (selectedDate: Date = new Date()) => {
  const fetchEvents = async (): Promise<Event[]> => {
    const startOfSelectedMonth = startOfMonth(selectedDate);
    const endOfSelectedMonth = endOfMonth(selectedDate);
    
    const formattedStart = format(startOfSelectedMonth, "yyyy-MM-dd");
    const formattedEnd = format(endOfSelectedMonth, "yyyy-MM-dd");
    
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("date", formattedStart)
      .lte("date", formattedEnd)
      .order("date", { ascending: true });
    
    if (error) {
      console.error("Error fetching events:", error);
      throw new Error(error.message);
    }
    
    return data || [];
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

  return {
    ...useQuery({
      queryKey: ["events", format(selectedDate, "yyyy-MM")],
      queryFn: fetchEvents,
    }),
    getEventsForDay,
    getEventsForWeek,
  };
};
