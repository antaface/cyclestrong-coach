
import { useState, useEffect } from "react";
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
    if (!user) {
      console.log("No user found, skipping cycle events fetch");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Fetching cycle events for user:", user.id);
      
      const { data, error } = await supabase
        .from('cycle_events')
        .select('date, phase')
        .eq('user_id', user.id)
        .order('date', { ascending: true });
      
      if (error) {
        console.error("Error fetching cycle events:", error);
        throw error;
      }
      
      console.log("Cycle events fetched:", data);
      
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
      } else {
        console.log("No cycle events found, checking if user has profile setup");
        // Check if user has a profile with last_period set
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('last_period, cycle_length')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else if (profileData && profileData.last_period) {
          console.log("Profile found with last_period, generating cycle events");
          // User has a profile but no cycle events, generate them
          await generateCycleEventsFromProfile(profileData);
        } else {
          console.log("No profile setup found");
          setCycleEvents([]);
        }
      }
    } catch (error) {
      console.error("Error in fetchCycleEvents:", error);
      toast({
        title: "Error",
        description: "Failed to load cycle data. Please try again.",
        variant: "destructive",
      });
      setCycleEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCycleEventsFromProfile = async (profileData: any) => {
    try {
      console.log("Generating cycle events from profile:", profileData);
      
      const { error: functionError } = await supabase.functions.invoke('generate-cycle-events', {
        body: { 
          data: {
            userId: user!.id,
            cycleLength: profileData.cycle_length || 28,
            lastPeriod: new Date(profileData.last_period).toISOString().split('T')[0]
          }
        }
      });
      
      if (functionError) {
        console.error("Error generating cycle events:", functionError);
        throw functionError;
      }
      
      console.log("Cycle events generated successfully, refetching...");
      // Fetch the newly generated events
      await fetchCycleEvents();
      
    } catch (error) {
      console.error("Error generating cycle events from profile:", error);
      toast({
        title: "Error",
        description: "Failed to generate cycle events. Please try updating your cycle manually.",
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

  // Auto-fetch on mount
  useEffect(() => {
    if (user) {
      fetchCycleEvents();
    }
  }, [user]);

  return {
    cycleEvents,
    isLoading,
    nextPeriodDate,
    daysUntilNextPeriod,
    fetchCycleEvents,
    handlePeriodDateUpdate
  };
};
