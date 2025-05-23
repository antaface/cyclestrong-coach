
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

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

  // Check if user has completed onboarding by checking their profile
  const checkOnboardingStatus = async (userId: string) => {
    try {
      console.log("Checking onboarding status for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('last_period, goal, training_age, cycle_length, one_rm')
        .eq('id', userId)
        .single();
      
      if (error) {
        // If we get a "No rows found" error, it means the profile doesn't exist,
        // which indicates the user needs onboarding
        if (error.code === 'PGRST116') {
          console.log("No profile found, user needs onboarding");
          setNeedsOnboarding(true);
          navigate('/onboarding');
          return;
        }
        throw error;
      }
      
      // If the user has a profile but critical fields are missing, they need onboarding
      const missingOnboarding = !data.one_rm || !data.cycle_length || !data.goal;
      console.log("Profile data:", data, "Needs onboarding:", missingOnboarding);
      setNeedsOnboarding(missingOnboarding);
      
      // If user is authenticated and doesn't need onboarding, redirect to home
      if (!missingOnboarding) {
        navigate('/home');
      } else {
        navigate('/onboarding');
      }
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
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          checkOnboardingStatus(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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
      
      // After successful signup, we should direct to login
      // The onAuthStateChange handler will take care of navigation if auto-login happens
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
      // Note: The onAuthStateChange handler will take care of navigation
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
