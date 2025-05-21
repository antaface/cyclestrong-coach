
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Workout, CyclePhase, WorkoutExercise } from '@/types';

// Mock data generation function for when no workoutId is provided
const getMockWorkoutData = (): Workout => {
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
};

// Function to fetch workout data from Supabase
const fetchWorkoutData = async (workoutId?: string): Promise<Workout | null> => {
  if (!workoutId) {
    return getMockWorkoutData();
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

export function useWorkoutData(workoutId?: string) {
  const { data: workout, isLoading, error } = useQuery({
    queryKey: ['workout', workoutId],
    queryFn: () => fetchWorkoutData(workoutId)
  });

  return { workout, isLoading, error };
}
