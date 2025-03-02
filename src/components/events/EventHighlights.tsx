
import { Event } from "@/hooks/use-events";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface EventHighlightsProps {
  events: Event[];
  isLoading: boolean;
  onSelectDate: (date: Date) => void;
}

export const EventHighlights = ({ events, isLoading, onSelectDate }: EventHighlightsProps) => {
  return (
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
              onClick={() => onSelectDate(new Date(event.date))}
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
  );
};
