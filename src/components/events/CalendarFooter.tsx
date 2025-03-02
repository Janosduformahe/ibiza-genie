
import { CalendarDays, Database } from "lucide-react";

export const CalendarFooter = () => {
  return (
    <div className="mt-8 flex justify-center text-white/80 text-sm">
      <div className="flex items-center gap-1">
        <CalendarDays className="h-4 w-4" />
        <span>Events are automatically updated from our curated database of Ibiza parties</span>
      </div>
    </div>
  );
};
