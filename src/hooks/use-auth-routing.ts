
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useAuthRouting() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const routeAfterAuth = async () => {
      // Wait for auth to be determined
      if (authLoading) return;
      
      // If no user, allow the current page (no redirect)
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // Check onboarding status from profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarded')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        const currentPath = location.pathname;
        
        // If not onboarded and not already on onboarding page, redirect to onboarding
        if (data && data.onboarded === false && currentPath !== '/onboarding') {
          console.log('User not onboarded, redirecting to onboarding');
          navigate('/onboarding');
        } 
        // If onboarded and on auth or onboarding pages, redirect to home
        else if (data && data.onboarded === true && 
                (currentPath.startsWith('/auth') || currentPath === '/onboarding')) {
          console.log('User already onboarded, redirecting to home');
          navigate('/home');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    routeAfterAuth();
  }, [user, authLoading, navigate, location.pathname]);
  
  return { loading };
}
