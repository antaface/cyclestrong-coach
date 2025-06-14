import { useState, useEffect } from "react";
import { addMonths } from "date-fns";
import { Info, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { CalendarLegend } from "@/components/calendar/CalendarLegend";
import { CalendarDayDialog } from "@/components/calendar/CalendarDayDialog";
import { EditCycleDialog } from "@/components/calendar/EditCycleDialog";
import { CyclePhase } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface CycleEvent {
  date: string;
  phase: CyclePhase;
}

const CalendarPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cycleEvents, setCycleEvents] = useState<CycleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPeriodDate, setNextPeriodDate] = useState<string | null>(null);
  const [daysUntilNextPeriod, setDaysUntilNextPeriod] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  
  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(addMonths(currentDate, -1));
  };

  const fetchCycleEvents = async () => {
    if (!user) return;
    
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
      toast({
        title: "Error",
        description: "Failed to load cycle data. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePeriodDateUpdate = async (newPeriodDate: Date) => {
    if (!user) return;
    
    try {
      console.log("Updating period date to:", newPeriodDate.toISOString().split('T')[0]);
      
      // First, delete existing cycle events for this user
      const { error: deleteError } = await supabase
        .from('cycle_events')
        .delete()
        .eq('user_id', user.id);
      
      if (deleteError) {
        console.error("Error deleting old cycle events:", deleteError);
        throw deleteError;
      }
      
      // Update the user's profile with the new last_period date
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          last_period: newPeriodDate.toISOString()
        })
        .eq('id', user.id);
      
      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }
      
      // Get user's cycle length for generating new events
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('cycle_length')
        .eq('id', user.id)
        .single();
      
      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        throw fetchError;
      }
      
      // Generate new cycle events using the edge function
      const { error: functionError } = await supabase.functions.invoke('generate-cycle-events', {
        body: { 
          userId: user.id,
          cycleLength: profileData.cycle_length || 28,
          lastPeriod: newPeriodDate.toISOString().split('T')[0]
        }
      });
      
      if (functionError) {
        console.error("Error generating cycle events:", functionError);
        throw functionError;
      }
      
      // Refresh the cycle events display
      await fetchCycleEvents();
      
      toast({
        title: "Success",
        description: "Your cycle has been updated successfully.",
      });
      
    } catch (error) {
      console.error("Error updating period date:", error);
      toast({
        title: "Error",
        description: "Failed to update cycle. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    const loadCycleEvents = async () => {
      setIsLoading(true);
      await fetchCycleEvents();
      setIsLoading(false);
    };
    
    loadCycleEvents();
  }, [user]);
  
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setIsDialogOpen(true);
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
                    onDayClick={handleDayClick} 
                  />
                </motion.div>
              </AnimatePresence>
            </Card>
          </div>
        )}
        
        <CalendarLegend 
          nextPeriodDate={nextPeriodDate} 
          daysUntilNextPeriod={daysUntilNextPeriod} 
        />
        
        <div className="mt-6">
          <EditCycleDialog onPeriodDateUpdate={handlePeriodDateUpdate} />
        </div>
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
