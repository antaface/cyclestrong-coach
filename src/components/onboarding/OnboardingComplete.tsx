
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingCompleteProps {
  onBack: () => void;
  onComplete: () => void;
  isSubmitting: boolean;
}

const OnboardingComplete = ({ 
  onBack, 
  onComplete, 
  isSubmitting 
}: OnboardingCompleteProps) => {
  return (
    <div className="form-container">
      <h2 className="text-xl font-semibold text-cs-neutral-900">You're All Set!</h2>
      <p className="text-cs-neutral-500 mb-6">Your personalized training program is ready</p>
      
      <div className="bg-cs-neutral-100 rounded-lg p-4 mb-6">
        <p className="text-sm text-cs-neutral-600">
          CycleStrong Coach will adapt your training program based on your menstrual cycle phases:
        </p>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex items-center">
            <span className="w-3 h-3 bg-cs-purple-light rounded-full mr-2"></span>
            <span><strong>Follicular Phase:</strong> Higher volume/intensity training</span>
          </li>
          <li className="flex items-center">
            <span className="w-3 h-3 bg-cs-purple rounded-full mr-2"></span>
            <span><strong>Ovulation:</strong> Peak strength and power performance</span>
          </li>
          <li className="flex items-center">
            <span className="w-3 h-3 bg-cs-pink-dark rounded-full mr-2"></span>
            <span><strong>Luteal Phase:</strong> Moderate volume and strategic deload</span>
          </li>
          <li className="flex items-center">
            <span className="w-3 h-3 bg-cs-pink rounded-full mr-2"></span>
            <span><strong>Menstrual Phase:</strong> Active recovery and lighter workouts</span>
          </li>
        </ul>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="w-1/3"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>
        <Button 
          onClick={onComplete}
          disabled={isSubmitting}
          className="w-2/3 ml-2 bg-cs-purple hover:bg-cs-purple-dark"
        >
          {isSubmitting ? "Saving..." : "Get Started"} <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingComplete;
