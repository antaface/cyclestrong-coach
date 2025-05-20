
import { Button } from "@/components/ui/button";

interface WorkoutTimerDisplayProps {
  timer: number;
  isTimerActive: boolean;
  formatTime: (seconds: number) => string;
  toggleTimer: () => void;
  resetTimer: () => void;
}

const WorkoutTimerDisplay = ({
  timer,
  isTimerActive,
  formatTime,
  toggleTimer,
  resetTimer
}: WorkoutTimerDisplayProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center bg-cs-neutral-100 px-3 py-2 rounded-lg">
        <span className="text-lg font-mono font-medium">{formatTime(timer)}</span>
        <div className="flex gap-1 mt-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-8 p-0"
            onClick={toggleTimer}
          >
            {isTimerActive ? "⏸" : "▶️"}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-8 p-0"
            onClick={resetTimer}
          >
            🔄
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTimerDisplay;
