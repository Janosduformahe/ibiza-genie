
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Event } from "@/hooks/use-events";

interface EventNotificationsProps {
  isError: boolean;
  error: Error | null;
  events: Event[];
  isLoading: boolean;
}

export const EventNotifications = ({ isError, error, events, isLoading }: EventNotificationsProps) => {
  if (isError) {
    return (
      <Alert className="mb-4 bg-white/90 border-red-500">
        <AlertTitle className="text-red-600">Error loading events</AlertTitle>
        <AlertDescription>
          {error?.message || "There was a problem loading the events. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (events.length === 0 && !isLoading && !isError) {
    return (
      <Alert className="mb-4 bg-white/90">
        <AlertTitle>No events found</AlertTitle>
        <AlertDescription>
          Click "Run Scraper Now" to fetch events from Ibiza party websites. The scraper uses IP rotation to avoid being blocked.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};
