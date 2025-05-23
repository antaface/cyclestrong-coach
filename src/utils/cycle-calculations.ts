
export interface CycleInfo {
  phase: string;
  day: number;
  phaseDescription: string;
}

export const calculateCycleInfo = (lastPeriod: string, cycleLength: number = 28): CycleInfo => {
  const lastPeriodDate = new Date(lastPeriod);
  const today = new Date();
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate current cycle day (1-indexed)
  const cycleDay = (daysSinceLastPeriod % cycleLength) + 1;
  
  // Determine phase based on cycle day
  let phase: string;
  let phaseDescription: string;
  
  if (cycleDay <= 5) {
    phase = 'Menstrual Phase';
    phaseDescription = 'Rest and recovery time. Focus on gentle movement and self-care.';
  } else if (cycleDay <= 13) {
    phase = 'Follicular Phase';
    phaseDescription = 'Your body is primed for high-intensity training today. Challenge yourself with heavier weights or more difficult variations.';
  } else if (cycleDay <= 16) {
    phase = 'Ovulation Phase';
    phaseDescription = 'Peak energy and strength. This is an excellent time for personal records and challenging workouts.';
  } else {
    phase = 'Luteal Phase';
    phaseDescription = 'Energy may fluctuate. Listen to your body and adjust intensity as needed.';
  }
  
  return {
    phase,
    day: cycleDay,
    phaseDescription
  };
};
