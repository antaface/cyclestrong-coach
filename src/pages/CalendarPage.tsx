
import { useState, useEffect } from "react";

import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import { CalendarContent } from "@/components/calendar/CalendarContent";
import { CalendarLegend } from "@/components/calendar/CalendarLegend";
import { CalendarDayDialog } from "@/components/calendar/CalendarDayDialog";
import { EditCycleDialog } from "@/components/calendar/EditCycleDialog";
import { CalendarLoadingState } from "@/components/calendar/CalendarLoadingState";
import { CalendarEmptyState } from "@/components/calendar/CalendarEmptyState";
import { useCycleEvents } from "@/hooks/use-cycle-events";

const CalendarPage = () => {
  const {
    cycleEvents,
    isLoading,
    setIsLoading,
    nextPeriodDate,
    daysUntilNextPeriod,
    fetchCycleEvents,
    handlePeriodDateUpdate
  } = useCycleEvents();

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const loadCycleEvents = async () => {
      setIsLoading(true);
      await fetchCycleEvents();
      setIsLoading(false);
    };
    
    loadCycleEvents();
  }, []);
  
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setIsDialogOpen(true);
  };

  const renderContent = () => {
    if (isLoading) {
      return <CalendarLoadingState />;
    }

    if (cycleEvents.length === 0) {
      return <CalendarEmptyState />;
    }

    return (
      <CalendarContent 
        cycleEvents={cycleEvents} 
        onDayClick={handleDayClick} 
      />
    );
  };
  
  return (
    <>
      <PageContainer title="Cycle Calendar">
        {renderContent()}
        
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
