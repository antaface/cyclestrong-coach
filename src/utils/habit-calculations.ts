
import type { HabitData, HabitEntry } from '@/types/habits';

// Calculate current streak
export const calculateStreak = (habitHistory: HabitEntry[]): number => {
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

// Get completed count for today's habits
export const getCompletedCount = (todaysHabits: HabitData): number => {
  return Object.values(todaysHabits).filter(Boolean).length;
};

// Get progress percentage for a specific habit
export const getProgressPercentage = (todaysHabits: HabitData, habitType: keyof HabitData): number => {
  return todaysHabits[habitType] ? 100 : 0;
};
