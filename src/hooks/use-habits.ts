
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from '@/hooks/use-toast';

interface HabitData {
  training: boolean;
  protein: boolean;
  sleep: boolean;
  mindset: boolean;
}

interface HabitEntry {
  date: string;
  habits: HabitData;
}

export const useHabits = () => {
  const [todaysHabits, setTodaysHabits] = useState<HabitData>({
    training: false,
    protein: false,
    sleep: false,
    mindset: false
  });
  
  const [habitHistory, setHabitHistory] = useState<HabitEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get user ID from auth context
  const { user } = useAuth();
  const userId = user?.id;
  
  // Get today's date in YYYY-MM-DD format
  const getTodaysDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Initialize habits data on mount or when user changes
  useEffect(() => {
    if (userId) {
      loadTodaysHabits();
      loadHabitHistory();
    }
  }, [userId]);

  // Load today's habits from Supabase
  const loadTodaysHabits = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const today = getTodaysDate();
      
      const { data, error } = await supabase
        .from('habits')
        .select('training, protein, sleep, mindset')
        .eq('user_id', userId)
        .eq('date', today)
        .single();
      
      if (error) {
        // If error is "No rows found", that's expected for a new day
        if (error.code !== 'PGRST116') {
          console.error("Error loading today's habits:", error);
        }
        return;
      }
      
      if (data) {
        setTodaysHabits(data);
      }
    } catch (error) {
      console.error("Error loading today's habits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load habit history from Supabase
  const loadHabitHistory = async () => {
    if (!userId) return;
    
    try {
      // Get habits from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('habits')
        .select('date, training, protein, sleep, mindset')
        .eq('user_id', userId)
        .gte('date', thirtyDaysAgoStr)
        .order('date', { ascending: false });
      
      if (error) {
        console.error("Error loading habit history:", error);
        return;
      }
      
      // Transform data to match expected format
      const formattedData: HabitEntry[] = data.map(entry => {
        const { date, ...habits } = entry;
        return {
          date,
          habits: habits as HabitData
        };
      });
      
      setHabitHistory(formattedData);
    } catch (error) {
      console.error("Error loading habit history:", error);
    }
  };

  // Save habit to Supabase database
  const saveHabitToDatabase = async (habitType: keyof HabitData, checked: boolean) => {
    if (!userId) {
      toast({
        title: "Not logged in",
        description: "Please log in to track your habits",
        variant: "destructive"
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      const today = getTodaysDate();
      
      // Check if today's row exists
      const { data: existingData, error: checkError } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', userId)
        .eq('date', today)
        .single();
      
      let success = false;
      
      if (checkError && checkError.code === 'PGRST116') {
        // Row doesn't exist, insert new row with defaults and this habit
        const newHabits = {
          training: false,
          protein: false,
          sleep: false,
          mindset: false,
          [habitType]: checked,
          user_id: userId,
          date: today
        };
        
        const { error: insertError } = await supabase
          .from('habits')
          .insert(newHabits);
        
        if (insertError) {
          throw insertError;
        }
        success = true;
      } else if (!checkError) {
        // Row exists, update just this habit
        const { error: updateError } = await supabase
          .from('habits')
          .update({ [habitType]: checked })
          .eq('user_id', userId)
          .eq('date', today);
        
        if (updateError) {
          throw updateError;
        }
        success = true;
      }
      
      // Update local state
      if (success) {
        // Update today's habits
        const newHabits = { ...todaysHabits, [habitType]: checked };
        setTodaysHabits(newHabits);
        
        // Update history (ensure we don't duplicate entries)
        const today = getTodaysDate();
        const updatedHistory = habitHistory.filter(entry => entry.date !== today);
        updatedHistory.push({ date: today, habits: newHabits });
        setHabitHistory(updatedHistory);
      }
      
      return success;
    } catch (error: any) {
      console.error("Error saving habit:", error);
      toast({
        title: "Error",
        description: "Failed to save habit progress",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHabit = async (habitType: keyof HabitData) => {
    const newValue = !todaysHabits[habitType];
    const success = await saveHabitToDatabase(habitType, newValue);
    
    if (success) {
      // Check for completion achievement
      const completedCount = Object.values({ ...todaysHabits, [habitType]: newValue }).filter(Boolean).length;
      
      if (completedCount === 4) {
        toast({
          title: "🎉 Perfect Day!",
          description: "You've completed all 4 habits today!",
        });
      }
    }
  };

  // Calculate current streak
  const calculateStreak = () => {
    if (habitHistory.length === 0) return 0;
    
    const sortedHistory = [...habitHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 0;
    
    for (const entry of sortedHistory) {
      const completedCount = Object.values(entry.habits).filter(Boolean).length;
      if (completedCount >= 3) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getCompletedCount = () => {
    return Object.values(todaysHabits).filter(Boolean).length;
  };

  const getProgressPercentage = (habitType: keyof HabitData) => {
    return todaysHabits[habitType] ? 100 : 0;
  };

  return {
    todaysHabits,
    isLoading,
    toggleHabit,
    getCompletedCount,
    getProgressPercentage,
    currentStreak: calculateStreak()
  };
};
