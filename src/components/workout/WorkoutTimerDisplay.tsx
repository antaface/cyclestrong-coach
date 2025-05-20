
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";

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
      <div className="text-center bg-accent/10 px-4 py-3 rounded-lg border border-border/30">
        <span className="font-display text-lg font-medium">{formatTime(timer)}</span>
        <div className="flex gap-2 mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 rounded-full bg-accent/10"
            onClick={toggleTimer}
          >
            {isTimerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 rounded-full bg-accent/10"
            onClick={resetTimer}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTimerDisplay;
