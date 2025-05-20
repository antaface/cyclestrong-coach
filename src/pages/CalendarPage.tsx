
import { useState, useEffect } from "react";
import { addMonths } from "date-fns";
import { Info, Loader2 } from "lucide-react";

import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { CalendarLegend } from "@/components/calendar/CalendarLegend";
import { CalendarDayDialog } from "@/components/calendar/CalendarDayDialog";
import { CyclePhase } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface CycleEvent {
  date: string;
  phase: CyclePhase;
}

const CalendarPage = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cycleEvents, setCycleEvents] = useState<CycleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPeriodDate, setNextPeriodDate] = useState<string | null>(null);
  const [daysUntilNextPeriod, setDaysUntilNextPeriod] = useState<number | null>(null);
  
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(addMonths(currentDate, -1));
  
  useEffect(() => {
    const fetchCycleEvents = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('cycle_events')
          .select('date, phase')
          .eq('user_id', user.id)
          .order('date', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setCycleEvents(data as CycleEvent[]);
          
          // Find next menstrual phase date
          const today = new Date().toISOString().split('T')[0];
          const nextMenstrualEvent = data
            .filter(event => 
              event.phase === CyclePhase.MENSTRUAL && 
              event.date >= today
            )
            .sort((a, b) => a.date.localeCompare(b.date))[0];
          
          if (nextMenstrualEvent) {
            setNextPeriodDate(nextMenstrualEvent.date);
            
            // Calculate days until next period
            const currentDate = new Date();
            const nextDate = new Date(nextMenstrualEvent.date);
            const diffTime = nextDate.getTime() - currentDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysUntilNextPeriod(diffDays);
          }
        }
      } catch (error) {
        console.error("Error fetching cycle events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCycleEvents();
  }, [user]);
  
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setIsDialogOpen(true);
  };
  
  return (
    <>
      <PageContainer title="Cycle Calendar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-cs-purple" />
            <p className="mt-4 text-cs-neutral-600">Loading your cycle data...</p>
          </div>
        ) : cycleEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Info className="h-10 w-10 text-cs-purple" />
            <p className="mt-4 text-cs-neutral-600">No cycle data available. Please complete your profile setup.</p>
          </div>
        ) : (
          <div className="mb-4">
            <CalendarHeader 
              currentDate={currentDate} 
              onNextMonth={nextMonth} 
              onPrevMonth={prevMonth} 
            />
            
            <CalendarGrid 
              currentDate={currentDate} 
              cycleEvents={cycleEvents} 
              onDayClick={handleDayClick} 
            />
          </div>
        )}
        
        <CalendarLegend 
          nextPeriodDate={nextPeriodDate} 
          daysUntilNextPeriod={daysUntilNextPeriod} 
        />
      </PageContainer>
      
      <CalendarDayDialog 
        selectedDay={selectedDay} 
        isDialogOpen={isDialogOpen} 
        setIsDialogOpen={setIsDialogOpen} 
        cycleEvents={cycleEvents} 
      />
      
      <Navbar />
    </>
  );
};

export default CalendarPage;
