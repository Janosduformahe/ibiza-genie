
import { Clock } from "lucide-react";

export const EventScheduleInfo = () => {
  return (
    <div className="bg-white/90 rounded-lg shadow p-4 mt-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Clock className="h-4 w-4 text-primary" />
        <span className="font-medium">Auto-Update Schedule</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Our system automatically scrapes event data every 48 hours from various Ibiza venues to keep this calendar up-to-date with the latest parties.
      </p>
    </div>
  );
};
