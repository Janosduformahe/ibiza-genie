
import { format } from "date-fns";
import { CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventCard } from "./EventCard";
import { Event } from "@/hooks/use-events";

interface DailyEventsProps {
  date: Date;
  events: Event[];
  isLoading: boolean;
}

export const DailyEvents = ({ date, events, isLoading }: DailyEventsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          Events for {format(date, "EEEE, MMMM do yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="h-40 rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                name={event.name}
                date={event.date}
                club={event.club}
                ticketLink={event.ticket_link}
                musicStyle={event.music_style}
                lineup={event.lineup}
                description={event.description}
                source={event.source}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No events found for this date</p>
            <p className="text-sm text-muted-foreground mt-1">Try selecting another date or use the "Scrape New Events" button</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
