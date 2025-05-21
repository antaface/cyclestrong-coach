
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Workout } from '@/types';

// Mock function for when we don't have a real workoutId
const mockUpdateWorkout = (updatedWorkout: Workout) => {
  console.log('Mock updating workout:', updatedWorkout);
  return Promise.resolve(updatedWorkout);
};

export function useWorkoutActions(workoutId?: string) {
  const queryClient = useQueryClient();

  // Update workout mutation
  const updateWorkoutMutation = useMutation({
    mutationFn: async (updatedWorkout: Workout) => {
      if (!workoutId) return mockUpdateWorkout(updatedWorkout);
      
      // Update session_json with the latest exercises
      const sessionData = typeof updatedWorkout.session_json === 'string' 
        ? JSON.parse(updatedWorkout.session_json)
        : updatedWorkout.session_json;
      
      sessionData.exercises = updatedWorkout.exercises;
      
      const { error } = await supabase
        .from('workouts')
        .update({
          session_json: sessionData,
          completed: updatedWorkout.completed
        })
        .eq('id', workoutId);

      if (error) throw error;
      return updatedWorkout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout', workoutId] });
      toast({
        title: "Workout updated",
        description: "Your progress has been saved",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  });

  // Toggle a set's completed status
  const toggleSetCompleted = (workout: Workout | null, exerciseIndex: number, setIndex: number) => {
    if (!workout) return;
    
    const updatedWorkout = JSON.parse(JSON.stringify(workout)) as Workout;
    const exercise = updatedWorkout.exercises?.[exerciseIndex];
    
    if (exercise && exercise.sets && exercise.sets[setIndex]) {
      exercise.sets[setIndex].completed = !exercise.sets[setIndex].completed;
      updateWorkoutMutation.mutate(updatedWorkout);
    }
  };

  // Add a new set to an exercise
  const addSetToExercise = (workout: Workout | null, exerciseIndex: number) => {
    if (!workout || !workout.exercises) return;
    
    const updatedWorkout = JSON.parse(JSON.stringify(workout)) as Workout;
    const exercise = updatedWorkout.exercises[exerciseIndex];
    
    if (exercise && exercise.sets && exercise.sets.length > 0) {
      // Copy the last set as a template for the new set
      const lastSet = exercise.sets[exercise.sets.length - 1];
      const newSet = { 
        weight: lastSet.weight, 
        reps: lastSet.reps, 
        rir: lastSet.rir, 
        completed: false 
      };
      
      exercise.sets.push(newSet);
      updateWorkoutMutation.mutate(updatedWorkout);
    }
  };

  // Complete the whole workout
  const completeWorkout = (workout: Workout | null) => {
    if (!workout) return;
    
    const updatedWorkout = { ...workout, completed: true };
    updateWorkoutMutation.mutate(updatedWorkout);
  };

  return {
    toggleSetCompleted,
    addSetToExercise,
    completeWorkout
  };
}
