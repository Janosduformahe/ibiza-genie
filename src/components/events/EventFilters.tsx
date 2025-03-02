
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface EventFiltersProps {
  onSourceChange: (value: string) => void;
}

export const EventFilters = ({ onSourceChange }: EventFiltersProps) => {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-white" />
      <span className="text-white">Filter by source:</span>
      <Select onValueChange={onSourceChange} defaultValue="all">
        <SelectTrigger className="w-[180px] bg-white/90">
          <SelectValue placeholder="All sources" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sources</SelectItem>
          <SelectItem value="clubtickets.com">Club Tickets</SelectItem>
          <SelectItem value="ibiza-spotlight.com">Ibiza Spotlight</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
