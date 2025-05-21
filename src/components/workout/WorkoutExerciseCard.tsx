import { cn } from "@/lib/utils";
import { WorkoutExercise } from "@/types";
import { Video, Plus, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface WorkoutExerciseCardProps {
  exercise: WorkoutExercise;
  exerciseIndex: number;
  workoutId: string;
  onSetComplete: (exerciseIndex: number, setIndex: number) => void;
  onAddSet?: (exerciseIndex: number) => void;
}

const WorkoutExerciseCard = ({
  exercise,
  exerciseIndex,
  workoutId,
  onSetComplete,
  onAddSet
}: WorkoutExerciseCardProps) => {
  const navigate = useNavigate();
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

  const handleAddSet = () => {
    if (onAddSet) {
      onAddSet(exerciseIndex);
    }
  };

  const handleOpenFormCheck = () => {
    navigate('/form-check', { 
      state: { 
        exerciseName: exercise.name,
        workoutId 
      }
    });
  };

  return (
    <Card key={exercise.id}>
      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-display text-lg">{exercise.name}</h3>
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 border-primary text-primary hover:bg-primary/10"
            onClick={handleOpenFormCheck}
          >
            <Video className="w-4 h-4 mr-1" />
            Form
          </Button>
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
            <div className="col-span-2 text-center">RIR</div>
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
                <button
                  onClick={() => onSetComplete(exerciseIndex, setIndex)}
                  className={cn(
                    "h-6 w-6 rounded-sm flex items-center justify-center transition-all duration-200",
                    "border transform active:scale-90",
                    set.completed 
                      ? "bg-joyful-coral border-joyful-coral text-white" 
                      : "border-gray-300 bg-transparent hover:border-joyful-coral/50"
                  )}
                  aria-label={set.completed ? "Mark set incomplete" : "Mark set complete"}
                >
                  {set.completed && <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
          
          <div className="mt-3 flex justify-center">
            <Button 
              variant="ghost"
              onClick={handleAddSet}
              className="px-0 h-auto text-joyful-coral font-medium hover:bg-transparent hover:underline"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Set
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutExerciseCard;
