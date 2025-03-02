
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface EventFiltersProps {
  onSourceChange: (value: string) => void;
}

export const EventFilters = ({
  onSourceChange
}: EventFiltersProps) => {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-white" />
      <Select onValueChange={onSourceChange} defaultValue="all">
        <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
          <SelectValue placeholder="Event Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="clubtickets.com">Club Tickets</SelectItem>
          <SelectItem value="ibiza-spotlight.com">Ibiza Spotlight</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
