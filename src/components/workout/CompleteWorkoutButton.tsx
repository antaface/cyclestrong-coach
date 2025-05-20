
import { Button } from "@/components/ui/button";

interface CompleteWorkoutButtonProps {
  isCompleted: boolean;
  onComplete: () => void;
}

const CompleteWorkoutButton = ({ isCompleted, onComplete }: CompleteWorkoutButtonProps) => {
  return (
    <div className="pt-4">
      <Button 
        className="w-full bg-cs-purple hover:bg-cs-purple-dark"
        disabled={isCompleted}
        onClick={onComplete}
      >
        {isCompleted ? "Workout Completed" : "Complete Workout"}
      </Button>
    </div>
  );
};

export default CompleteWorkoutButton;
