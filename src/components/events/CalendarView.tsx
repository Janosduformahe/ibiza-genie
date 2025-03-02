
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useEvents } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, isSameDay } from "date-fns";

interface CalendarViewProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

export const CalendarView = ({ onSelectDate, selectedDate }: CalendarViewProps) => {
  const [month, setMonth] = useState<Date>(selectedDate);
  const { data: events = [], isLoading } = useEvents(month);

  const handlePreviousMonth = () => {
    setMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setMonth(prev => addMonths(prev, 1));
  };

  // Create a function to count events for each day in the month
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          {format(month, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelectDate(date)}
        month={month}
        onMonthChange={setMonth}
        className="rounded-md border"
        modifiers={{
          hasEvents: (date) => getEventsForDate(date).length > 0
        }}
        modifiersStyles={{
          hasEvents: {
            fontWeight: "bold",
            backgroundColor: "rgba(139, 92, 246, 0.15)",
            color: "#8B5CF6"
          }
        }}
        disabled={{ before: new Date() }}
      />
    </div>
  );
};
