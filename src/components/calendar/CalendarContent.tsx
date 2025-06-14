
import { useState } from "react";
import { addMonths } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { Card } from "@/components/ui/card";
import { CyclePhase } from "@/types";

interface CycleEvent {
  date: string;
  phase: CyclePhase;
}

interface CalendarContentProps {
  cycleEvents: CycleEvent[];
  onDayClick: (day: Date) => void;
}

export const CalendarContent = ({ cycleEvents, onDayClick }: CalendarContentProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0);
  
  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(addMonths(currentDate, -1));
  };

  const calendarVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 300 : -300,
        opacity: 0
      };
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? 300 : -300,
        opacity: 0
      };
    }
  };

  return (
    <div className="mb-4">
      <CalendarHeader 
        currentDate={currentDate} 
        onNextMonth={nextMonth} 
        onPrevMonth={prevMonth} 
      />
      
      <Card className="p-4 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentDate.getMonth()}
            custom={direction}
            variants={calendarVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.3 }}
          >
            <CalendarGrid 
              currentDate={currentDate} 
              cycleEvents={cycleEvents} 
              onDayClick={onDayClick} 
            />
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
};
