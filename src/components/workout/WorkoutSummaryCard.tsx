
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CyclePhase, Workout } from "@/types";

interface WorkoutSummaryCardProps {
  workout: Workout;
}

const WorkoutSummaryCard = ({ workout }: WorkoutSummaryCardProps) => {
  // Extract workout details
  const workoutDetails = workout.session_json ? 
    (typeof workout.session_json === 'string' ? 
      JSON.parse(workout.session_json) : 
      workout.session_json) : 
    {};

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-display text-xl mb-1">{workoutDetails.name || 'Today\'s Workout'}</h2>
            <p className="text-sm text-muted-foreground">
              {workoutDetails.description || 'Complete your workout for today'}
            </p>
            <div className="flex gap-2 mt-3">
              <Badge className="capitalize">{workout.phase} Phase</Badge>
              <Badge variant="outline" className="text-muted-foreground border-border">
                Cycle Day {/* Would calculate from profile data */}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutSummaryCard;
