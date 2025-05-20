
import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import CycleInfoForm from "./CycleInfoForm";
import TrainingBackgroundForm from "./TrainingBackgroundForm";
import StrengthForm from "./StrengthForm";
import OnboardingComplete from "./OnboardingComplete";
import { useOnboardingForm } from "@/hooks/use-onboarding-form";
import { useOnboardingSubmission } from "@/hooks/use-onboarding-submission";

const OnboardingContainer = () => {
  const [step, setStep] = useState(1);
  const maxSteps = 4;
  
  const { formData, updateFormData } = useOnboardingForm();
  const { isSubmitting, completeOnboarding } = useOnboardingSubmission();

  const handleNext = () => {
    if (step < maxSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    completeOnboarding(formData);
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
            onComplete={handleComplete}
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
