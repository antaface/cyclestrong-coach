
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface UserProfile {
  user_id: string;
  cycle_length: number;
  last_period: Date;
  training_age: number;
  goal: string;
  one_rm?: Record<string, number>; // e.g., { "squat": 100, "bench": 60 }
}

export enum CyclePhase {
  FOLLICULAR = "follicular",
  OVULATION = "ovulation",
  LUTEAL = "luteal",
  MENSTRUAL = "menstrual"
}

export interface CycleEvent {
  user_id: string;
  date: Date;
  phase: CyclePhase;
}

export interface Program {
  program_id: string;
  user_id: string;
  plan_json: string; // JSON string containing the program details
  start_date: Date;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: Array<{
    weight: number;
    reps: number;
    rir: number;
    completed: boolean;
  }>;
  notes?: string;
}

export interface Workout {
  workout_id: string;
  program_id: string;
  date: Date;
  phase: CyclePhase;
  session_json: string; // JSON string containing workout details
  completed: boolean;
  exercises?: WorkoutExercise[];
}

export interface FormReview {
  review_id: string;
  workout_id: string;
  exercise: string;
  score: number; // 0-10
  issues_json: string; // JSON string containing feedback
  video_url: string;
}

export interface Habit {
  habit_id: string;
  user_id: string;
  date: Date;
  training: boolean;
  protein: boolean;
  sleep: boolean;
  mindset: boolean;
}

export interface ExerciseLibrary {
  [key: string]: {
    name: string;
    muscle_group: string;
    description: string;
    video_url?: string;
  };
}
