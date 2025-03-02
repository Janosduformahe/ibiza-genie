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
  return <div className="flex flex-wrap gap-2">
      <EventScraper refetchEvents={refetchEvents} />
      
      
    </div>;
};