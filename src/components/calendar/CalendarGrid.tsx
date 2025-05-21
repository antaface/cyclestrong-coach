
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { CyclePhase } from "@/types";

interface CycleEvent {
  date: string;
  phase: CyclePhase;
}

interface CalendarGridProps {
  currentDate: Date;
  cycleEvents: CycleEvent[];
  onDayClick: (day: Date) => void;
}

export const CalendarGrid = ({ 
  currentDate, 
  cycleEvents, 
  onDayClick 
}: CalendarGridProps) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const getDayClass = (day: Date) => {
    // Format date to match the format in cycleEvents
    const formattedDate = day.toISOString().split('T')[0];
    
    // Find if this day is in the cycle events
    const cycleDay = cycleEvents.find(d => d.date === formattedDate);
    
    if (!cycleDay) return "cycle-day-empty";
    
    switch (cycleDay.phase) {
      case CyclePhase.FOLLICULAR:
        return "cycle-day-follicular";
      case CyclePhase.OVULATION:
        return "cycle-day-ovulation";
      case CyclePhase.LUTEAL:
        return "cycle-day-luteal";
      case CyclePhase.MENSTRUAL:
        return "cycle-day-menstrual";
    }
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-xs font-medium text-cs-neutral-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth.getDay() }).map((_, i) => (
          <div key={`empty-start-${i}`} className="p-1"></div>
        ))}
        
        {daysInMonth.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          return (
            <div
              key={day.toString()}
              className={cn(
                "p-1 flex items-center justify-center",
                !isCurrentMonth && "opacity-50"
              )}
            >
              <button
                onClick={() => onDayClick(day)}
                className={cn(
                  "cycle-day",
                  getDayClass(day),
                  isToday(day) && "ring-2 ring-offset-1 ring-offset-background ring-primary"
                )}
              >
                {day.getDate()}
              </button>
            </div>
          );
        })}
        
        {Array.from({
          length: 6 - lastDayOfMonth.getDay()
        }).map((_, i) => (
          <div key={`empty-end-${i}`} className="p-1"></div>
        ))}
      </div>
    </div>
  );
};
