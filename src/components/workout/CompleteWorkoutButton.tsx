
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
        className="w-full h-14 text-base font-display shadow-md transform transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:opacity-80"
        size="lg"
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
      {isCompleted && (
        <p className="text-center text-sm text-muted-foreground mt-3 animate-fade-in">
          Great job! Your progress has been saved.
        </p>
      )}
    </div>
  );
};

export default CompleteWorkoutButton;
