
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
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-medium text-lg">{workoutDetails.name || 'Today\'s Workout'}</h2>
            <p className="text-sm text-cs-neutral-600">
              {workoutDetails.description || 'Complete your workout for today'}
            </p>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-cs-purple capitalize">{workout.phase} Phase</Badge>
              <Badge variant="outline" className="text-cs-neutral-600 border-cs-neutral-300">
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
