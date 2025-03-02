
import { Clock, RefreshCcw } from "lucide-react";

export const EventScheduleInfo = () => {
  return (
    <div className="bg-white/90 rounded-lg shadow p-4 mt-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <RefreshCcw className="h-4 w-4 text-primary" />
        <span className="font-medium">Auto-Update System</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Our system automatically updates the calendar with the latest Ibiza events every 48 hours, ensuring you always have accurate information about upcoming parties and club nights.
      </p>
    </div>
  );
};
