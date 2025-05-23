
export interface HabitData {
  training: boolean;
  protein: boolean;
  sleep: boolean;
  mindset: boolean;
}

export interface HabitEntry {
  date: string;
  habits: HabitData;
}

export type HabitType = keyof HabitData;
