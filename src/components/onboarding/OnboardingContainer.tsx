
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/layout/PageContainer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import CycleInfoForm from "./CycleInfoForm";
import TrainingBackgroundForm from "./TrainingBackgroundForm";
import StrengthForm from "./StrengthForm";
import OnboardingComplete from "./OnboardingComplete";

const OnboardingContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxSteps = 4;
  
  // Form data state
  const [formData, setFormData] = useState({
    cycleLength: 28,
    lastPeriod: undefined as Date | undefined,
    trainingAge: "beginner",
    goal: "",
    oneRM: {
      squat: undefined as number | undefined,
      bench: undefined as number | undefined,
      deadlift: undefined as number | undefined,
      hipThrust: undefined as number | undefined,
    }
  });

  const handleNext = () => {
    if (step < maxSteps) setStep(step + 1);
    else completeOnboarding();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const generateCycleEvents = async (userId: string, cycleLength: number, lastPeriodDate: Date) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        console.error("Auth session error:", error);
        throw new Error("Authentication required");
      }
      
      // Use the correct way to get the Supabase URL - using string literal with project ID
      const supabaseUrl = "https://sxeglgdcrfpfgtdexeje.supabase.co";
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-cycle-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({
          data: {
            userId,
            cycleLength,
            lastPeriod: lastPeriodDate.toISOString(),
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate cycle events");
      }
      
      const result = await response.json();
      console.log("Generated cycle events:", result);
      return result;
    } catch (error: any) {
      console.error("Error generating cycle events:", error);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    if (!user) {
      toast.error("User not found. Please sign in again.");
      navigate("/auth");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
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
        }
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
      
      navigate("/");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save profile data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CycleInfoForm 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
          />
        );
      case 2:
        return (
          <TrainingBackgroundForm
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StrengthForm
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <OnboardingComplete
            onBack={handleBack}
            onComplete={() => completeOnboarding()}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer showBackButton={step > 1} title="Set Up Your Profile">
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="flex justify-between items-center mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-full h-1 rounded-full ${
                s < step ? "bg-cs-purple" : 
                s === step ? "bg-cs-purple-light" : 
                "bg-cs-neutral-200"
              }`}
            ></div>
          ))}
        </div>
        
        {renderStep()}
      </div>
    </PageContainer>
  );
};

export default OnboardingContainer;
