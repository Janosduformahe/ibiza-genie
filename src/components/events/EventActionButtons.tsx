
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
import { EventScraper } from "./EventScraper";

interface EventActionButtonsProps {
  onFindNextParty: () => void;
  refetchEvents: () => void;
}

export const EventActionButtons = ({ 
  onFindNextParty,
  refetchEvents
}: EventActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <EventScraper refetchEvents={refetchEvents} />
      
      <Button 
        onClick={onFindNextParty}
        className="bg-white text-primary hover:bg-white/90"
      >
        <PartyPopper className="mr-2 h-4 w-4" />
        Find Next Party
      </Button>
    </div>
  );
};
