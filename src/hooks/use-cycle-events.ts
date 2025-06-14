
import { useState } from "react";
import { CyclePhase } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CycleEvent {
  date: string;
  phase: CyclePhase;
}

export const useCycleEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cycleEvents, setCycleEvents] = useState<CycleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPeriodDate, setNextPeriodDate] = useState<string | null>(null);
  const [daysUntilNextPeriod, setDaysUntilNextPeriod] = useState<number | null>(null);

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
      
      // Generate new cycle events using the edge function with correct data structure
      const { error: functionError } = await supabase.functions.invoke('generate-cycle-events', {
        body: { 
          data: {
            userId: user.id,
            cycleLength: profileData.cycle_length || 28,
            lastPeriod: newPeriodDate.toISOString().split('T')[0]
          }
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

  return {
    cycleEvents,
    isLoading,
    setIsLoading,
    nextPeriodDate,
    daysUntilNextPeriod,
    fetchCycleEvents,
    handlePeriodDateUpdate
  };
};
