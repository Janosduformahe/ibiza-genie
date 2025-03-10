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

// Mock events for Ibiza parties
const mockEvents: Event[] = [
  {
    id: "1",
    name: "Pacha Ibiza Opening Party",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 23, 0, 0).toISOString(),
    club: "Pacha Ibiza",
    ticket_link: "https://www.pacha.com/events/",
    music_style: ["House", "Dance", "Electronic"],
    lineup: ["David Guetta", "Martin Solveig", "Solomun"],
    price_range: "30€ - 60€",
    description: "The legendary opening party at Pacha Ibiza featuring top DJs and amazing production.",
    source: "pacha.com"
  },
  {
    id: "2",
    name: "Amnesia Pyramid Party",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5, 23, 30, 0).toISOString(),
    club: "Amnesia",
    ticket_link: "https://www.amnesia.es/events/",
    music_style: ["Techno", "House", "Electronic"],
    lineup: ["Adam Beyer", "Charlotte de Witte", "Nina Kraviz"],
    price_range: "25€ - 55€",
    description: "Experience the ultimate Techno night at Amnesia's Pyramid party with a stacked lineup.",
    source: "amnesia.es"
  },
  {
    id: "3",
    name: "Ushuaïa Poolside Sessions",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 8, 16, 0, 0).toISOString(),
    club: "Ushuaïa Ibiza",
    ticket_link: "https://www.theushuaiaexperience.com/events/",
    music_style: ["Deep House", "Tech House", "Progressive"],
    lineup: ["Black Coffee", "Camelphat", "Damian Lazarus"],
    price_range: "40€ - 80€",
    description: "Daytime poolside party at Ushuaïa featuring the best in Deep House and Tech House.",
    source: "ushuaia.com"
  },
  {
    id: "4",
    name: "Hï Ibiza - Tale Of Us Afterlife",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10, 23, 59, 0).toISOString(),
    club: "Hï Ibiza",
    ticket_link: "https://www.hiibiza.com/events/",
    music_style: ["Melodic Techno", "Progressive", "Electronica"],
    lineup: ["Tale Of Us", "Mind Against", "Mathame"],
    price_range: "35€ - 65€",
    description: "The iconic Afterlife party hosted by Tale Of Us at Hï Ibiza, featuring mesmerizing production and sounds.",
    source: "hiibiza.com"
  },
  {
    id: "5",
    name: "Eden Defected Ibiza",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 15, 23, 0, 0).toISOString(),
    club: "Eden Ibiza",
    ticket_link: "https://www.edenibiza.com/events/",
    music_style: ["House", "Disco", "Vocal House"],
    lineup: ["Sam Divine", "Low Steppa", "Simon Dunmore"],
    price_range: "25€ - 45€",
    description: "Defected Records brings their signature House sound to Eden Ibiza with a stacked lineup.",
    source: "edenibiza.com"
  },
  {
    id: "6",
    name: "Es Paradis Water Party",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 18, 23, 30, 0).toISOString(),
    club: "Es Paradis",
    ticket_link: "https://www.esparadis.com/events/",
    music_style: ["Dance", "House", "Commercial"],
    lineup: ["Hedkandi DJs", "Caal", "Brandon Block"],
    price_range: "20€ - 40€",
    description: "The famous water party at Es Paradis. Don't forget your swimming attire!",
    source: "esparadis.com"
  },
  {
    id: "7",
    name: "Ibiza Rocks Pool Party",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 22, 14, 0, 0).toISOString(),
    club: "Ibiza Rocks Hotel",
    ticket_link: "https://www.ibizarocks.com/events/",
    music_style: ["Bass", "UK Garage", "Hip Hop"],
    lineup: ["Craig David", "Rudimental", "Joel Corry"],
    price_range: "30€ - 50€",
    description: "Daytime pool party featuring the biggest UK acts in a vibrant atmosphere.",
    source: "ibizarocks.com"
  },
  {
    id: "8",
    name: "DC-10 Circoloco",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 25, 23, 0, 0).toISOString(),
    club: "DC-10",
    ticket_link: "https://www.dc10ibiza.com/events/",
    music_style: ["Techno", "Minimal", "House"],
    lineup: ["Seth Troxler", "The Martinez Brothers", "Jamie Jones"],
    price_range: "30€ - 55€",
    description: "The legendary Circoloco party at DC-10, widely regarded as one of the best parties in Ibiza.",
    source: "dc10ibiza.com"
  },
  {
    id: "9",
    name: "Destino Maceo Plex Showcase",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 30, 18, 0, 0).toISOString(),
    club: "Destino Ibiza",
    ticket_link: "https://www.destinoibiza.com/events/",
    music_style: ["Tech House", "Electronica", "Deep Tech"],
    lineup: ["Maceo Plex", "Dixon", "DJ Koze"],
    price_range: "35€ - 65€",
    description: "Sunset session at the beautiful Destino resort curated by Maceo Plex.",
    source: "destinoibiza.com"
  },
  {
    id: "10",
    name: "Pikes Hotel Mercury Rising",
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 3, 22, 0, 0).toISOString(),
    club: "Pikes Hotel",
    ticket_link: "https://www.pikesibiza.com/events/",
    music_style: ["Disco", "House", "Balearic"],
    lineup: ["DJ Harvey", "Horsemeat Disco", "Artwork"],
    price_range: "20€ - 40€",
    description: "Intimate party at the legendary Pikes Hotel, known for its unique atmosphere and history.",
    source: "pikesibiza.com"
  }
];

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
      // First try to get real events from the database
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
      
      // If we have database events, use those
      if (data && data.length > 0) {
        console.log(`Found ${data.length} events in the database for the selected period`);
        return data;
      } 
      
      // Otherwise use mock events
      console.log("No events found in database, using mock events");
      
      // Filter mock events based on the selected date range
      let filteredMockEvents = mockEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= extendedStart && eventDate <= extendedEnd;
      });
      
      // Apply source filter if provided
      if (source) {
        filteredMockEvents = filteredMockEvents.filter(event => event.source === source);
      }
      
      console.log(`Returning ${filteredMockEvents.length} mock events`);
      return filteredMockEvents;
    } catch (error) {
      console.error("Error in fetchEvents:", error);
      toast({
        title: "Error fetching events",
        description: "Failed to load events. Please try again later.",
        variant: "destructive"
      });
      // Return mock events in case of an error
      return mockEvents;
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
