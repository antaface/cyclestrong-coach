
import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { toast } from '@/hooks/use-toast';
import type { HabitEntry } from '@/types/habits';
import { supabase } from "@/integrations/supabase/client";

export const useHabitHistory = () => {
  const [habitHistory, setHabitHistory] = useState<HabitEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      loadHabitHistory();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const loadHabitHistory = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Get habits from the last 14 days
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('habits')
        .select('date, training, protein, sleep, mindset')
        .eq('user_id', userId)
        .gte('date', fourteenDaysAgoStr)
        .order('date', { ascending: false });
      
      if (error) {
        console.error("Error loading habit history:", error);
        toast({
          title: "Error",
          description: "Failed to load habit history",
          variant: "destructive"
        });
        return;
      }
      
      // Transform data to match expected format and fill in missing days
      const transformedData = data?.map(entry => {
        const { date, ...habits } = entry;
        return {
          date,
          habits: habits as { training: boolean; protein: boolean; sleep: boolean; mindset: boolean; }
        };
      }) || [];
      
      // Create array of the last 14 days with empty habits for missing days
      const last14Days: HabitEntry[] = [];
      for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const existingEntry = transformedData.find(entry => entry.date === dateStr);
        if (existingEntry) {
          last14Days.push(existingEntry);
        } else {
          last14Days.push({
            date: dateStr,
            habits: {
              training: false,
              protein: false,
              sleep: false,
              mindset: false
            }
          });
        }
      }
      
      setHabitHistory(last14Days);
    } catch (error) {
      console.error("Error loading habit history:", error);
      toast({
        title: "Error",
        description: "Failed to load habit history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    habitHistory,
    isLoading,
    refreshHistory: loadHabitHistory
  };
};
