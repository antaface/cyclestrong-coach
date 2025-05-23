
import { useState, useEffect } from 'react';
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

  // Mock user ID - TODO: Replace with actual auth user ID
  const mockUserId = "user-123";
  
  // Get today's date in YYYY-MM-DD format
  const getTodaysDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Initialize habits data on mount
  useEffect(() => {
    loadTodaysHabits();
    loadHabitHistory();
  }, []);

  // TODO: Replace with actual Supabase query
  const loadTodaysHabits = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - check if we already have habits for today
      const today = getTodaysDate();
      const existingEntry = habitHistory.find(entry => entry.date === today);
      
      if (existingEntry) {
        setTodaysHabits(existingEntry.habits);
      }
      
      console.log(`[MOCK DB] Loading habits for user ${mockUserId} on ${today}`);
    } catch (error) {
      console.error("Error loading today's habits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Replace with actual Supabase query
  const loadHabitHistory = async () => {
    try {
      // Mock habit history for streak calculation
      const mockHistory: HabitEntry[] = [
        {
          date: '2025-01-20',
          habits: { training: true, protein: true, sleep: true, mindset: false }
        },
        {
          date: '2025-01-21',
          habits: { training: true, protein: true, sleep: false, mindset: true }
        },
        {
          date: '2025-01-22',
          habits: { training: false, protein: true, sleep: true, mindset: true }
        }
      ];
      
      setHabitHistory(mockHistory);
      console.log("[MOCK DB] Loaded habit history:", mockHistory);
    } catch (error) {
      console.error("Error loading habit history:", error);
    }
  };

  // TODO: Replace with actual Supabase upsert
  const saveHabitToDatabase = async (habitType: keyof HabitData, checked: boolean) => {
    setIsLoading(true);
    try {
      const today = getTodaysDate();
      
      // Simulate database upsert operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log(`[MOCK DB] Upserting habit for user ${mockUserId}:`, {
        user_id: mockUserId,
        date: today,
        [habitType]: checked,
        updated_at: new Date().toISOString()
      });
      
      // Update local state
      const newHabits = { ...todaysHabits, [habitType]: checked };
      setTodaysHabits(newHabits);
      
      // Update history
      const updatedHistory = habitHistory.filter(entry => entry.date !== today);
      updatedHistory.push({ date: today, habits: newHabits });
      setHabitHistory(updatedHistory);
      
      return true;
    } catch (error) {
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
    
    const sortedHistory = [...habitHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
