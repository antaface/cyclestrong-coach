
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';
import type { HabitData, HabitType } from '@/types/habits';

// Get today's date in YYYY-MM-DD format
export const getTodaysDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Load today's habits from Supabase
export const loadTodaysHabits = async (userId: string): Promise<HabitData | null> => {
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
      return null;
    }
    
    return data as HabitData;
  } catch (error) {
    console.error("Error loading today's habits:", error);
    return null;
  }
};

// Load habit history from Supabase
export const loadHabitHistory = async (userId: string) => {
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
      return [];
    }
    
    // Transform data to match expected format
    return data.map(entry => {
      const { date, ...habits } = entry;
      return {
        date,
        habits: habits as HabitData
      };
    });
  } catch (error) {
    console.error("Error loading habit history:", error);
    return [];
  }
};

// Save habit to Supabase database
export const saveHabitToDatabase = async (
  userId: string,
  habitType: HabitType,
  checked: boolean
): Promise<boolean> => {
  if (!userId) {
    toast({
      title: "Not logged in",
      description: "Please log in to track your habits",
      variant: "destructive"
    });
    return false;
  }
  
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
    
    return success;
  } catch (error: any) {
    console.error("Error saving habit:", error);
    toast({
      title: "Error",
      description: "Failed to save habit progress",
      variant: "destructive"
    });
    return false;
  }
};
