
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  cycle_length: number;
  last_period: string;
  training_age: string;
  goal: string;
  one_rm?: Record<string, number>;
}

export const useProfileData = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          // Create a properly typed UserProfile object from the data
          const typedProfile: UserProfile = {
            id: data.id,
            cycle_length: data.cycle_length,
            last_period: data.last_period,
            training_age: data.training_age,
            goal: data.goal,
            one_rm: data.one_rm ? (typeof data.one_rm === 'string' 
              ? JSON.parse(data.one_rm) 
              : data.one_rm as Record<string, number>) : undefined
          };
          
          setUserProfile(typedProfile);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  return { userProfile, loading };
};
