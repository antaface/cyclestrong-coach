
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";

interface WorkoutTimerDisplayProps {
  timer: number;
  isTimerActive: boolean;
  formatTime: (seconds: number) => string;
  toggleTimer: () => void;
  resetTimer: () => void;
}

const WorkoutTimerDisplay = ({
  isTimerActive,
  toggleTimer,
  resetTimer
}: WorkoutTimerDisplayProps) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 transition-transform active:scale-95"
        onClick={toggleTimer}
      >
        {isTimerActive ? 
          <Pause className="h-5 w-5" /> : 
          <Play className="h-5 w-5" />
        }
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 transition-transform active:scale-95"
        onClick={resetTimer}
      >
        <RotateCcw className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default WorkoutTimerDisplay;
