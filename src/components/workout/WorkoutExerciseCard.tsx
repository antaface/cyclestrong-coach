
import { cn } from "@/lib/utils";
import { WorkoutExercise } from "@/types";
import { Check, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ExerciseFormReview from "./ExerciseFormReview";

interface WorkoutExerciseCardProps {
  exercise: WorkoutExercise;
  exerciseIndex: number;
  workoutId: string;
  onSetComplete: (exerciseIndex: number, setIndex: number) => void;
}

const WorkoutExerciseCard = ({
  exercise,
  exerciseIndex,
  workoutId,
  onSetComplete
}: WorkoutExerciseCardProps) => {
  return (
    <Card key={exercise.id}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{exercise.name}</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 border-cs-purple text-cs-purple hover:bg-cs-purple/10"
                >
                  <Video className="w-4 h-4 mr-1" />
                  Form
                </Button>
              </DialogTrigger>
              <ExerciseFormReview exercise={exercise} workoutId={workoutId} />
            </Dialog>
          </div>
          
          {exercise.notes && (
            <p className="text-xs text-cs-neutral-500 mt-1">
              {exercise.notes}
            </p>
          )}
          
          <div className="mt-3">
            <div className="grid grid-cols-12 gap-1 text-xs text-cs-neutral-500 mb-1">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Weight</div>
              <div className="col-span-2">Reps</div>
              <div className="col-span-2">RIR</div>
              <div className="col-span-4">Done</div>
            </div>
            
            {exercise.sets.map((set, setIndex) => (
              <div 
                key={`${exercise.id}-set-${setIndex}`}
                className={cn(
                  "grid grid-cols-12 gap-1 py-2 items-center text-sm border-t border-gray-100",
                  set.completed && "bg-cs-neutral-100"
                )}
              >
                <div className="col-span-1 font-medium">{setIndex + 1}</div>
                <div className="col-span-3">{set.weight} kg</div>
                <div className="col-span-2">{set.reps}</div>
                <div className="col-span-2">{set.rir}</div>
                <div className="col-span-4">
                  <Button
                    variant={set.completed ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-8 w-16",
                      set.completed ? 
                        "bg-cs-purple hover:bg-cs-purple-dark" : 
                        "border-cs-purple text-cs-purple hover:bg-cs-purple/10"
                    )}
                    onClick={() => onSetComplete(exerciseIndex, setIndex)}
                  >
                    {set.completed ? (
                      <>
                        <Check className="w-4 h-4 mr-1" /> Done
                      </>
                    ) : (
                      "Mark"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutExerciseCard;
