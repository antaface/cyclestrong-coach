
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface CompleteWorkoutButtonProps {
  isCompleted: boolean;
  onComplete: () => void;
}

const CompleteWorkoutButton = ({ 
  isCompleted, 
  onComplete 
}: CompleteWorkoutButtonProps) => {
  return (
    <div className="py-6">
      <Button
        onClick={onComplete}
        disabled={isCompleted}
        className="w-full h-12 text-base"
      >
        {isCompleted ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Workout Completed
          </>
        ) : (
          "Complete Workout"
        )}
      </Button>
    </div>
  );
};

export default CompleteWorkoutButton;
