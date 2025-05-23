
import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { toast } from '@/hooks/use-toast';
import type { HabitData, HabitEntry, HabitType } from '@/types/habits';
import { 
  loadTodaysHabits, 
  loadHabitHistory, 
  saveHabitToDatabase,
  getTodaysDate
} from '@/utils/habit-database';
import { 
  calculateStreak, 
  getCompletedCount, 
  getProgressPercentage 
} from '@/utils/habit-calculations';

export const useHabits = () => {
  const [todaysHabits, setTodaysHabits] = useState<HabitData>({
    training: false,
    protein: false,
    sleep: false,
    mindset: false
  });
  
  const [habitHistory, setHabitHistory] = useState<HabitEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get user ID from auth context
  const { user } = useAuth();
  const userId = user?.id;

  // Initialize habits data on mount or when user changes
  useEffect(() => {
    if (userId) {
      initializeHabits();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const initializeHabits = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Load today's habits
      const todaysData = await loadTodaysHabits(userId);
      if (todaysData) {
        // Pre-check habits that are already marked true
        setTodaysHabits(todaysData);
      } else {
        // No row exists for today, leave all checkboxes empty
        setTodaysHabits({
          training: false,
          protein: false,
          sleep: false,
          mindset: false
        });
      }
      
      // Load habit history
      const historyData = await loadHabitHistory(userId);
      setHabitHistory(historyData);
    } catch (error) {
      console.error("Error initializing habits:", error);
      toast({
        title: "Error",
        description: "Failed to load habit data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHabit = async (habitType: HabitType) => {
    if (!userId) return;
    
    const newValue = !todaysHabits[habitType];
    const success = await saveHabitToDatabase(userId, habitType, newValue);
    
    if (success) {
      // Update local state
      const newHabits = { ...todaysHabits, [habitType]: newValue };
      setTodaysHabits(newHabits);
      
      // Update history (ensure we don't duplicate entries)
      const today = getTodaysDate();
      const updatedHistory = habitHistory.filter(entry => entry.date !== today);
      updatedHistory.push({ date: today, habits: newHabits });
      setHabitHistory(updatedHistory);
      
      // Check for completion achievement
      const completedCount = getCompletedCount(newHabits);
      
      if (completedCount === 4) {
        toast({
          title: "🎉 Perfect Day!",
          description: "You've completed all 4 habits today!",
        });
      }
    }
  };

  return {
    todaysHabits,
    isLoading,
    toggleHabit,
    getCompletedCount: () => getCompletedCount(todaysHabits),
    getProgressPercentage: (habitType: HabitType) => getProgressPercentage(todaysHabits, habitType),
    currentStreak: calculateStreak(habitHistory)
  };
};
