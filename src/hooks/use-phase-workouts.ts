
import { useState, useEffect } from 'react';
import { WorkoutTemplate } from '@/components/workout/WorkoutTemplateCard';
import { CyclePhase } from '@/types';
import { useCycleEvents } from './use-cycle-events';

// This is temporary mock data - would be replaced with Supabase queries
const mockTemplates: WorkoutTemplate[] = [
  {
    id: '1',
    phase: 'menstrual',
    title: 'Gentle Core + Mobility',
    description: 'Light movement to reduce cramps and support recovery.',
    session_json: [
      { exercise: "Cat-Cow / Pelvic Tilts", sets: 2, reps: 10, rir: 4, note: "Focus on breathing and gentle control" },
      { exercise: "Glute Bridges", sets: 2, reps: 12, rir: 3 },
      { exercise: "Bird-Dogs", sets: 2, reps: 10, rir: 3 }
    ]
  },
  {
    id: '2',
    phase: 'menstrual',
    title: 'Stretch + Stability',
    description: 'A low-impact session to stay mobile without stress.',
    session_json: [
      { exercise: "Wall Dead Bug Hold", sets: 3, reps: 30, rir: 3, note: "Maintain gentle abdominal pressure" },
      { exercise: "Supported Cossack Squat", sets: 2, reps: 8, rir: 3 },
      { exercise: "Thoracic Rotations", sets: 2, reps: 10, rir: 4 }
    ]
  },
  {
    id: '3',
    phase: 'follicular',
    title: 'Heavy Lower Body Push',
    description: 'Tap into high estrogen recovery and go heavy on legs.',
    session_json: [
      { exercise: "Back Squat", sets: 4, reps: 6, rir: 1 },
      { exercise: "RDL", sets: 3, reps: 8, rir: 2 },
      { exercise: "Hip Thrust", sets: 3, reps: 10, rir: 1 }
    ]
  },
  {
    id: '4',
    phase: 'follicular',
    title: 'Pull Day + Core',
    description: 'Progressive upper body pulling strength with core finish.',
    session_json: [
      { exercise: "Pull-Ups or Lat Pulldown", sets: 4, reps: 6, rir: 2 },
      { exercise: "Barbell Row", sets: 3, reps: 8, rir: 2 },
      { exercise: "Weighted Deadbug", sets: 3, reps: 10, rir: 2 }
    ]
  },
  {
    id: '5',
    phase: 'luteal',
    title: 'Deload Full Body Circuit',
    description: 'Lower volume and slower tempo to manage fatigue.',
    session_json: [
      { exercise: "Goblet Squat", sets: 3, reps: 10, rir: 3 },
      { exercise: "Incline DB Press", sets: 3, reps: 10, rir: 2 },
      { exercise: "Cable Row", sets: 3, reps: 12, rir: 3 }
    ]
  },
  {
    id: '6',
    phase: 'luteal',
    title: 'Light Upper Body Push',
    description: 'Controlled movements focusing on form and stability.',
    session_json: [
      { exercise: "Push-ups", sets: 3, reps: 8, rir: 2 },
      { exercise: "Shoulder Press", sets: 3, reps: 10, rir: 2 },
      { exercise: "Lat Pulldown", sets: 3, reps: 12, rir: 2 }
    ]
  },
  {
    id: '7',
    phase: 'luteal',
    title: 'Gentle Lower Body Focus',
    description: 'Bodyweight movements with minimal equipment needs.',
    session_json: [
      { exercise: "Bulgarian Split Squat", sets: 3, reps: 10, rir: 2 },
      { exercise: "Glute Bridge", sets: 3, reps: 12, rir: 2 },
      { exercise: "Calf Raises", sets: 3, reps: 15, rir: 2 }
    ]
  },
  {
    id: '8',
    phase: 'ovulation',
    title: 'Maximum Strength Day',
    description: 'Peak performance day - go for PRs and heavy lifts.',
    session_json: [
      { exercise: "Deadlift", sets: 5, reps: 3, rir: 1 },
      { exercise: "Bench Press", sets: 4, reps: 5, rir: 1 },
      { exercise: "Pull-ups", sets: 4, reps: 6, rir: 1 }
    ]
  }
];

// Helper function to determine current phase from cycle events
const getCurrentPhaseFromEvents = (cycleEvents: any[]): CyclePhase => {
  if (cycleEvents.length === 0) return CyclePhase.LUTEAL; // Default fallback
  
  const today = new Date().toISOString().split('T')[0];
  
  // Find the most recent event on or before today
  const relevantEvents = cycleEvents
    .filter(event => event.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date));
  
  if (relevantEvents.length === 0) {
    // If no past events, look for future events and work backwards
    const futureEvents = cycleEvents
      .filter(event => event.date > today)
      .sort((a, b) => a.date.localeCompare(b.date));
    
    if (futureEvents.length > 0) {
      // Return the phase before the next event
      const nextPhase = futureEvents[0].phase;
      const phaseOrder = [CyclePhase.MENSTRUAL, CyclePhase.FOLLICULAR, CyclePhase.OVULATION, CyclePhase.LUTEAL];
      const nextIndex = phaseOrder.indexOf(nextPhase as CyclePhase);
      const currentIndex = nextIndex > 0 ? nextIndex - 1 : phaseOrder.length - 1;
      return phaseOrder[currentIndex];
    }
  }
  
  return relevantEvents[0]?.phase as CyclePhase || CyclePhase.LUTEAL;
};

export function usePhaseWorkouts() {
  const { cycleEvents, isLoading: cycleLoading } = useCycleEvents();
  const [currentPhase, setCurrentPhase] = useState<CyclePhase>(CyclePhase.LUTEAL);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!cycleLoading && cycleEvents) {
      console.log("Determining current phase from cycle events:", cycleEvents);
      const phase = getCurrentPhaseFromEvents(cycleEvents);
      console.log("Current phase determined:", phase);
      setCurrentPhase(phase);
      setIsLoading(false);
    }
  }, [cycleEvents, cycleLoading]);

  useEffect(() => {
    // Filter templates based on current phase
    if (currentPhase) {
      console.log("Filtering templates for phase:", currentPhase);
      const phaseTemplates = mockTemplates.filter(t => t.phase === currentPhase.toLowerCase());
      console.log("Templates found for phase:", phaseTemplates);
      setTemplates(phaseTemplates);
    }
  }, [currentPhase]);

  return { currentPhase, templates, isLoading: isLoading || cycleLoading };
}
