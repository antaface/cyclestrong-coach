
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Workout, WorkoutExercise, CyclePhase } from '@/types';

export function useWorkout(workoutId?: string) {
  const queryClient = useQueryClient();
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isTimerActive) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isTimerActive]);

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const resetTimer = () => {
    setTimer(0);
    setIsTimerActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock current data if no workout ID is provided (temporary until proper onboarding)
  const getWorkoutData = async (): Promise<Workout | null> => {
    if (!workoutId) {
      // Return mock data if no workoutId
      return {
        workout_id: "mock-workout",
        program_id: "mock-program",
        date: new Date(),
        phase: CyclePhase.LUTEAL,
        session_json: JSON.stringify({
          name: "Lower Body Strength - Luteal Phase",
          description: "Focus on progressive overload with moderate weights",
        }),
        completed: false,
        exercises: [
          {
            id: "ex1",
            name: "Goblet Squat",
            sets: [
              { weight: 20, reps: 10, rir: 2, completed: false },
              { weight: 22.5, reps: 10, rir: 2, completed: false },
              { weight: 25, reps: 8, rir: 2, completed: false },
            ],
            notes: "Focus on depth and keeping chest up"
          },
          {
            id: "ex2",
            name: "Romanian Deadlift",
            sets: [
              { weight: 40, reps: 12, rir: 2, completed: false },
              { weight: 40, reps: 12, rir: 2, completed: false },
              { weight: 40, reps: 10, rir: 2, completed: false },
            ],
            notes: "Maintain neutral spine, feel stretch in hamstrings"
          },
          {
            id: "ex3",
            name: "Hip Thrust",
            sets: [
              { weight: 50, reps: 10, rir: 2, completed: false },
              { weight: 50, reps: 10, rir: 2, completed: false },
              { weight: 50, reps: 10, rir: 2, completed: false },
            ]
          }
        ]
      };
    }

    // Get actual workout data from Supabase
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', workoutId)
      .single();

    if (error) {
      console.error('Error fetching workout:', error);
      return null;
    }

    // Parse session_json to get exercises
    const parsedSession = JSON.parse(data.session_json as string);
    return {
      workout_id: data.id,
      program_id: data.program_id,
      date: new Date(data.date),
      phase: data.phase as CyclePhase,
      session_json: data.session_json as string,
      completed: data.completed,
      exercises: parsedSession.exercises || []
    };
  };

  const { data: workout, isLoading, error } = useQuery({
    queryKey: ['workout', workoutId],
    queryFn: getWorkoutData
  });

  // Update workout data in Supabase
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

  // Mock function for when we don't have a real workoutId yet
  const mockUpdateWorkout = (updatedWorkout: Workout) => {
    // In a real app, this would save to Supabase
    console.log('Mock updating workout:', updatedWorkout);
    return Promise.resolve(updatedWorkout);
  };

  // Toggle a set's completed status
  const toggleSetCompleted = (exerciseIndex: number, setIndex: number) => {
    if (!workout) return;
    
    const updatedWorkout = { ...workout };
    const set = updatedWorkout.exercises![exerciseIndex].sets[setIndex];
    set.completed = !set.completed;
    
    updateWorkoutMutation.mutate(updatedWorkout);
  };

  // Complete the whole workout
  const completeWorkout = () => {
    if (!workout) return;
    
    const updatedWorkout = { ...workout, completed: true };
    updateWorkoutMutation.mutate(updatedWorkout);
  };

  return {
    workout,
    isLoading,
    error,
    timer,
    isTimerActive,
    toggleTimer,
    resetTimer,
    formatTime,
    toggleSetCompleted,
    completeWorkout
  };
}
