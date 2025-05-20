
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Define types for our program data structure
export interface Exercise {
  name: string;
  sets: number;
  reps: string | number;
  intensity?: string;
  notes?: string;
}

export interface Workout {
  day: number;
  focus: string;
  notes?: string;
  exercises: Exercise[];
}

export interface ProgramWeek {
  theme?: string;
  workouts: Workout[];
}

export interface ProgramData {
  title?: string;
  description?: string;
  weeks: ProgramWeek[];
  raw_output?: string;
}

export interface Program {
  id: string;
  user_id: string;
  plan_json: ProgramData;
  start_date: string;
  created_at: string;
}

export function useProgram() {
  const { user } = useAuth();
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProgram();
    }
  }, [user]);

  const fetchUserProgram = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Get the raw Supabase program data
        const supabaseProgram = data[0];
        
        // Create a properly typed program object
        const typedProgram: Program = {
          id: supabaseProgram.id,
          user_id: supabaseProgram.user_id,
          start_date: supabaseProgram.start_date,
          created_at: supabaseProgram.created_at,
          plan_json: parseProgramData(supabaseProgram.plan_json)
        };
        
        setProgram(typedProgram);
      } else {
        setProgram(null);
      }
    } catch (error: any) {
      console.error("Error fetching program:", error);
      toast.error("Failed to load your program");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to safely parse program data
  const parseProgramData = (planJson: unknown): ProgramData => {
    try {
      // If plan_json is a string, try to parse it as JSON
      let parsedData: any = planJson;
      
      if (typeof planJson === 'string') {
        try {
          parsedData = JSON.parse(planJson);
        } catch (e) {
          console.error("Failed to parse program JSON string:", e);
          return { title: "Program", description: "Could not parse program data", weeks: [] };
        }
      }
      
      // Ensure weeks array exists
      if (!parsedData.weeks || !Array.isArray(parsedData.weeks)) {
        parsedData.weeks = [];
      }
      
      return parsedData as ProgramData;
    } catch (error) {
      console.error("Error parsing program data:", error);
      return { title: "Program", description: "Error parsing program data", weeks: [] };
    }
  };

  const generateProgram = async () => {
    if (!user) {
      toast.error("You need to be logged in");
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Get user profile data first
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Call the GPT edge function to generate program
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Authentication required");
        return;
      }
      
      const supabaseUrl = "https://sxeglgdcrfpfgtdexeje.supabase.co";
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-program`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          data: {
            userId: user.id,
            profile: profileData,
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate program");
      }
      
      await fetchUserProgram();
      toast.success("Your personalized 4-week program has been created!");
    } catch (error: any) {
      console.error("Error generating program:", error);
      toast.error(error.message || "Failed to generate your program");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    program,
    isLoading,
    isGenerating,
    fetchUserProgram,
    generateProgram
  };
}
