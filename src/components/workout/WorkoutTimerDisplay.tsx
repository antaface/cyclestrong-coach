
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pause, Play, RotateCcw } from "lucide-react";

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
    <Card className="ml-4 min-w-[120px]">
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-mono mb-2">{formatTime(timer)}</div>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={toggleTimer}
          >
            {isTimerActive ? 
              <Pause className="h-4 w-4" /> : 
              <Play className="h-4 w-4" />
            }
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={resetTimer}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutTimerDisplay;
