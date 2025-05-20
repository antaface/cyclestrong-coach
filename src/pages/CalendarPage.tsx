
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isSameMonth, isSameDay, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Info, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";
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
  
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  
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
  
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setIsDialogOpen(true);
  };
  
  const getPhaseInfo = (day: Date) => {
    const formattedDate = day.toISOString().split('T')[0];
    const cycleDay = cycleEvents.find(d => d.date === formattedDate);
    
    if (!cycleDay) return null;
    
    const phaseInfo = {
      [CyclePhase.FOLLICULAR]: {
        title: "Follicular Phase",
        description: "Your estrogen levels are rising. This is a great time for high-intensity workouts and building strength.",
        trainingTip: "Focus on progressive overload. You might feel stronger than usual, so challenge yourself with heavier weights or more challenging variations."
      },
      [CyclePhase.OVULATION]: {
        title: "Ovulation Phase",
        description: "Your estrogen peaks and testosterone slightly increases. Your energy and strength are typically at their highest.",
        trainingTip: "Excellent time for personal records and high-intensity training. Take advantage of your peak strength and coordination."
      },
      [CyclePhase.LUTEAL]: {
        title: "Luteal Phase",
        description: "Progesterone rises while estrogen drops. You may notice decreased energy and increased body temperature.",
        trainingTip: "Focus on moderate volume work. Emphasize technique and consider reducing weight slightly if needed. Good time for deload."
      },
      [CyclePhase.MENSTRUAL]: {
        title: "Menstrual Phase",
        description: "Hormone levels are at their lowest. Energy levels vary widely between individuals.",
        trainingTip: "Listen to your body. Consider active recovery or lighter workouts if you experience discomfort. Still, many women find strength training beneficial for reducing symptoms."
      }
    };
    
    return phaseInfo[cycleDay.phase];
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
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" onClick={prevMonth} className="p-1 h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-medium">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <Button variant="ghost" onClick={nextMonth} className="p-1 h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
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
                      onClick={() => handleDayClick(day)}
                      className={cn(
                        "cycle-day",
                        getDayClass(day),
                        isToday(day) && "ring-2 ring-cs-purple"
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
        )}
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-cs-neutral-800">Phase Legend</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Info className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-cs-pink rounded-full mr-2"></span>
              <span className="text-sm">Menstrual</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-cs-purple-light rounded-full mr-2"></span>
              <span className="text-sm">Follicular</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-cs-purple rounded-full mr-2"></span>
              <span className="text-sm">Ovulation</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-cs-pink-dark rounded-full mr-2"></span>
              <span className="text-sm">Luteal</span>
            </div>
          </div>
        </div>
        
        {nextPeriodDate && daysUntilNextPeriod !== null && (
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Menstrual Phase</CardTitle>
              <CardDescription>Starting in {daysUntilNextPeriod} days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-cs-neutral-600">
                Consider planning a deload week to align with your upcoming menstrual phase. This is a good time to focus on recovery and mobility work.
              </p>
            </CardContent>
          </Card>
        )}
      </PageContainer>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedDay && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {format(selectedDay, "EEEE, MMMM d")}
              </DialogTitle>
              <DialogDescription>
                {getPhaseInfo(selectedDay)?.title || "Outside tracked cycle"}
              </DialogDescription>
            </DialogHeader>
            
            {getPhaseInfo(selectedDay) ? (
              <div className="space-y-4">
                <p className="text-sm text-cs-neutral-600">
                  {getPhaseInfo(selectedDay)?.description}
                </p>
                
                <div className="bg-cs-neutral-100 p-3 rounded-md">
                  <p className="font-medium text-cs-neutral-900 mb-1">Training Tip</p>
                  <p className="text-sm text-cs-neutral-600">
                    {getPhaseInfo(selectedDay)?.trainingTip}
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-cs-neutral-900 mb-1">Recommended Focus</p>
                  <div className="flex gap-2">
                    {getPhaseInfo(selectedDay)?.title === "Follicular Phase" && (
                      <>
                        <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Strength</span>
                        <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Power</span>
                        <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">High Intensity</span>
                      </>
                    )}
                    {getPhaseInfo(selectedDay)?.title === "Ovulation Phase" && (
                      <>
                        <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Max Strength</span>
                        <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">PRs</span>
                        <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Power</span>
                      </>
                    )}
                    {getPhaseInfo(selectedDay)?.title === "Luteal Phase" && (
                      <>
                        <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Technique</span>
                        <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Moderate Volume</span>
                        <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Deload</span>
                      </>
                    )}
                    {getPhaseInfo(selectedDay)?.title === "Menstrual Phase" && (
                      <>
                        <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Recovery</span>
                        <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Light Activity</span>
                        <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Mobility</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-cs-neutral-600">
                This date is outside your tracked cycle. Update your cycle information to see recommendations for this day.
              </p>
            )}
          </DialogContent>
        )}
      </Dialog>
      
      <Navbar />
    </>
  );
};

export default CalendarPage;
