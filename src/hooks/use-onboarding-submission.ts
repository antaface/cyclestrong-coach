
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { generateCycleEvents } from "@/utils/generate-cycle-events";

type OnboardingFormData = {
  cycleLength: number;
  lastPeriod: Date | undefined;
  trainingAge: string;
  goal: string;
  oneRM: {
    squat: number | undefined;
    bench: number | undefined;
    deadlift: number | undefined;
    hipThrust: number | undefined;
  }
};

export function useOnboardingSubmission() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeOnboarding = async (formData: OnboardingFormData) => {
    if (!user) {
      toast.error("User not found. Please sign in again.");
      navigate("/auth");
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Completing onboarding for user:", user.id);
      
      // Combine all form data
      const lastPeriodDate = formData.lastPeriod;
      
      if (!lastPeriodDate) {
        toast.error("Last period date is required");
        return;
      }
      
      const profileData = {
        id: user.id,
        cycle_length: formData.cycleLength,
        last_period: lastPeriodDate.toISOString(),
        goal: formData.goal,
        training_age: formData.trainingAge,
        one_rm: {
          squat: formData.oneRM.squat || 0,
          bench: formData.oneRM.bench || 0,
          deadlift: formData.oneRM.deadlift || 0,
          hip_thrust: formData.oneRM.hipThrust || 0,
        },
        onboarded: true // Mark the user as onboarded
      };
      
      console.log("Saving profile data:", profileData);
      
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Generate cycle events after saving profile
      try {
        await generateCycleEvents(user.id, formData.cycleLength, lastPeriodDate);
        toast.success("Profile setup complete! Your cycle events have been generated.");
      } catch (eventsError: any) {
        console.error("Error generating cycle events:", eventsError);
        toast.error("Profile saved but there was an issue generating your cycle calendar. Please try refreshing.");
      }
      
      console.log("Onboarding complete - routeAfterAuth will handle navigation");
      // Remove manual navigation - let routeAfterAuth handle it after the profile update
      return true;
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save profile data");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    completeOnboarding
  };
}
