
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkoutExerciseCard from "./WorkoutExerciseCard";
import { WorkoutExercise } from "@/types";

interface ExerciseListProps {
  exercises: WorkoutExercise[];
  workoutId: string;
  onSetComplete: (exerciseIndex: number, setIndex: number) => void;
  onAddSet?: (exerciseIndex: number) => void;
}

const ExerciseList = ({ exercises, workoutId, onSetComplete, onAddSet }: ExerciseListProps) => {
  return (
    <>
      <div className="space-y-4">
        {exercises && exercises.map((exercise, exerciseIndex) => (
          <WorkoutExerciseCard
            key={exercise.id}
            exercise={exercise}
            exerciseIndex={exerciseIndex}
            workoutId={workoutId}
            onSetComplete={onSetComplete}
          />
        ))}
      </div>
      
      {/* Add exercise button */}
      <div className="flex justify-center mt-4">
        <Button 
          variant="outline" 
          className="border-dashed border-accent text-muted-foreground hover:bg-accent/5"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Exercise
        </Button>
      </div>
    </>
  );
};

export default ExerciseList;
