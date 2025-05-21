
import { Card, CardContent } from "@/components/ui/card";
import { Workout } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface WorkoutSummaryCardProps {
  workout: Workout;
}

const WorkoutSummaryCard = ({ workout }: WorkoutSummaryCardProps) => {
  // Parse session_json if it's a string
  const sessionInfo = typeof workout.session_json === 'string'
    ? JSON.parse(workout.session_json)
    : workout.session_json;
  
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="font-display text-xl">{sessionInfo.name}</h2>
        <p className="text-sm text-muted-foreground mt-1">{sessionInfo.description}</p>
        <div className="flex mt-2 text-xs text-muted-foreground">
          <div className="mr-4">
            <span className="font-medium">Started:</span> {formatDistanceToNow(workout.date, { addSuffix: true })}
          </div>
          <div className="capitalize">
            <span className="font-medium">Phase:</span> {workout.phase}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutSummaryCard;
