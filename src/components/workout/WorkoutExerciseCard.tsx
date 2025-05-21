
import { cn } from "@/lib/utils";
import { WorkoutExercise } from "@/types";
import { Video } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [setWeights, setSetWeights] = useState<{[key: number]: string}>(
    exercise.sets.reduce((acc, set, idx) => ({...acc, [idx]: set.weight?.toString() || ""}), {})
  );
  
  const [setReps, setSetReps] = useState<{[key: number]: string}>(
    exercise.sets.reduce((acc, set, idx) => ({...acc, [idx]: set.reps?.toString() || ""}), {})
  );

  const handleWeightChange = (setIndex: number, value: string) => {
    setSetWeights(prev => ({...prev, [setIndex]: value}));
  };

  const handleRepsChange = (setIndex: number, value: string) => {
    setSetReps(prev => ({...prev, [setIndex]: value}));
  };

  return (
    <Card key={exercise.id}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-display text-lg">{exercise.name}</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 border-primary text-primary hover:bg-primary/10"
              >
                <Video className="w-4 h-4 mr-1" />
                Form
              </Button>
            </DialogTrigger>
            <ExerciseFormReview exercise={exercise} workoutId={workoutId} />
          </Dialog>
        </div>
        
        {exercise.notes && (
          <p className="text-sm text-muted-foreground mb-2">
            {exercise.notes}
          </p>
        )}
        
        <div className="mt-2">
          <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground mb-2 px-1">
            <div className="col-span-1 text-left">#</div>
            <div className="col-span-3">Weight</div>
            <div className="col-span-3">Reps</div>
            <div className="col-span-2">RIR</div>
            <div className="col-span-3 text-right">Done</div>
          </div>
          
          {exercise.sets.map((set, setIndex) => (
            <div 
              key={`${exercise.id}-set-${setIndex}`}
              className={cn(
                "grid grid-cols-12 gap-2 py-2 items-center text-sm border-t border-border/20",
                set.completed && "bg-accent/10 rounded-md"
              )}
            >
              <div className="col-span-1 font-medium">{setIndex + 1}</div>
              
              <div className="col-span-3">
                <Input
                  type="number"
                  min="0"
                  value={setWeights[setIndex]}
                  onChange={(e) => handleWeightChange(setIndex, e.target.value)}
                  className="h-8 text-sm py-1 px-2"
                  placeholder={`${set.weight || 0}`}
                />
              </div>
              
              <div className="col-span-3">
                <Input
                  type="number"
                  min="0"
                  value={setReps[setIndex]}
                  onChange={(e) => handleRepsChange(setIndex, e.target.value)}
                  className="h-8 text-sm py-1 px-2"
                  placeholder={`${set.reps || 0}`}
                />
              </div>
              
              <div className="col-span-2 text-center">{set.rir}</div>
              
              <div className="col-span-3 flex justify-end items-center">
                <Checkbox
                  checked={set.completed}
                  onCheckedChange={() => onSetComplete(exerciseIndex, setIndex)}
                  className={cn(
                    "h-6 w-6 border-2",
                    set.completed ? "border-primary" : "border-border"
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutExerciseCard;
