
import { Globe } from "lucide-react";

export const CalendarFooter = () => {
  return (
    <div className="mt-8 flex justify-center text-white/80 text-sm">
      <div className="flex items-center gap-1">
        <Globe className="h-4 w-4" />
        <span>Events are automatically updated every 48 hours with IP rotation</span>
      </div>
    </div>
  );
};
