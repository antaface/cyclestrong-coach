
import { useState } from "react";

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

export function useOnboardingForm() {
  // Form data state
  const [formData, setFormData] = useState<OnboardingFormData>({
    cycleLength: 28,
    lastPeriod: undefined,
    trainingAge: "beginner",
    goal: "",
    oneRM: {
      squat: undefined,
      bench: undefined,
      deadlift: undefined,
      hipThrust: undefined,
    }
  });

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return {
    formData,
    updateFormData
  };
}
