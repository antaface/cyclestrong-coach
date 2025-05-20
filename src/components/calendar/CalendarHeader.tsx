
import { format, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader = ({ 
  currentDate, 
  onPrevMonth, 
  onNextMonth 
}: CalendarHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Button variant="ghost" onClick={onPrevMonth} className="p-1 h-8 w-8">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="font-medium">
        {format(currentDate, 'MMMM yyyy')}
      </h2>
      <Button variant="ghost" onClick={onNextMonth} className="p-1 h-8 w-8">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
