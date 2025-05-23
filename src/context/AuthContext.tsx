
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { routeAfterAuth } from "@/utils/routeAfterAuth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  needsOnboarding: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user has completed onboarding by checking their profile
  const checkOnboardingStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarded')
        .eq('id', userId)
        .single();
      
      if (error) {
        // If we get a "No rows found" error, it means the profile doesn't exist,
        // which indicates the user needs onboarding
        if (error.code === 'PGRST116') {
          setNeedsOnboarding(true);
          return;
        }
        throw error;
      }
      
      // Use the onboarded flag to determine if user needs onboarding
      setNeedsOnboarding(data.onboarded === false);
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setNeedsOnboarding(true);
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast.success("Signed in successfully");
          
          // Check if user needs onboarding after sign in
          if (session?.user) {
            setTimeout(() => {
              checkOnboardingStatus(session.user.id);
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          toast.info("Signed out");
          setNeedsOnboarding(false);
          navigate('/landing');
        }
        
        // Run global routing after any auth state change
        setTimeout(() => {
          routeAfterAuth(navigate, location.pathname);
        }, 100);
      }
    );

    // Then check for existing session and run initial routing
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          checkOnboardingStatus(session.user.id);
        }, 0);
      }
      
      // Run global routing on app initialization
      routeAfterAuth(navigate, location.pathname);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log("Attempting to sign up:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;
      
      console.log("Signup successful:", data);
      toast.success("Signup successful! Please sign in to complete your profile setup.");
      
      // The onAuthStateChange handler will take care of navigation via routeAfterAuth
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "An error occurred during signup");
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("Signin successful:", data.user?.email);
      // The onAuthStateChange handler will take care of navigation via routeAfterAuth
    } catch (error: any) {
      console.error("Signin error:", error);
      toast.error(error.message || "An error occurred during sign in");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign out");
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    needsOnboarding,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
