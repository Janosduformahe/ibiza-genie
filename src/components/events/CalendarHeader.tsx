
import { PartyPopper } from "lucide-react";

export const CalendarHeader = () => {
  return (
    <div className="flex flex-col gap-2 mb-6 text-white">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <PartyPopper className="h-8 w-8" />
        Ibiza Party Calendar
      </h1>
      <p className="opacity-90">Find the hottest parties and events happening on the island</p>
    </div>
  );
};
