
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useWorkout } from "@/hooks/use-workout";
import { usePhaseWorkouts } from "@/hooks/use-phase-workouts";
import { WorkoutTemplate } from '@/components/workout/WorkoutTemplateCard';

import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import WorkoutTimerDisplay from "@/components/workout/WorkoutTimerDisplay";
import WorkoutPageLoading from "@/components/workout/WorkoutPageLoading";
import WorkoutPageError from "@/components/workout/WorkoutPageError";
import WorkoutTemplateList from "@/components/workout/WorkoutTemplateList";
import ExerciseList from "@/components/workout/ExerciseList";
import CompleteWorkoutButton from "@/components/workout/CompleteWorkoutButton";

// Define interface for session json structure
interface WorkoutSessionJson {
  name: string;
  description: string;
}

const WorkoutPage = () => {
  const { toast } = useToast();
  const [activeWorkout, setActiveWorkout] = useState(false);
  const { currentPhase, templates, isLoading: phaseLoading } = usePhaseWorkouts();
  
  // Get workout data when an active workout is selected
  const { 
    workout, 
    isLoading: workoutLoading, 
    error, 
    timer, 
    isTimerActive, 
    toggleTimer, 
    resetTimer, 
    formatTime,
    toggleSetCompleted,
    completeWorkout,
    addSetToExercise
  } = useWorkout(); // No ID means we get mock data for now
  
  const handleStartSession = (template: WorkoutTemplate) => {
    // In a real implementation, we would create a new workout in Supabase
    // and redirect to the workout detail page
    toast({
      title: "Workout started",
      description: `You've started the ${template.title} workout`,
    });
    setActiveWorkout(true);
  };
  
  const handleCompleteWorkout = () => {
    completeWorkout();
    setActiveWorkout(false);
    toast({
      title: "Workout completed!",
      description: "Great job! Your workout has been marked as complete.",
    });
  };

  // Helper function to get phase-specific colors
  const getPhaseColors = (phase: string) => {
    switch(phase?.toLowerCase()) {
      case 'menstrual':
        return 'bg-joyful-clay/10 border-joyful-clay/20';
      case 'follicular':
        return 'bg-joyful-coral/10 border-joyful-coral/20';
      case 'ovulation':
        return 'bg-joyful-orange/10 border-joyful-orange/20';
      case 'luteal':
        return 'bg-joyful-peach/10 border-joyful-peach/20';
      default:
        return 'bg-white/50 border-border/30';
    }
  };

  // Helper function to safely get session data
  const getSessionData = (): WorkoutSessionJson => {
    if (!workout || !workout.session_json) {
      return { name: "Workout Session", description: "" };
    }
    
    if (typeof workout.session_json === 'string') {
      try {
        return JSON.parse(workout.session_json) as WorkoutSessionJson;
      } catch (e) {
        console.error("Error parsing session JSON:", e);
        return { name: "Workout Session", description: "" };
      }
    }
    
    return workout.session_json as unknown as WorkoutSessionJson;
  };

  if (phaseLoading || workoutLoading) {
    return <WorkoutPageLoading />;
  }
  
  if (error && activeWorkout) {
    return <WorkoutPageError />;
  }
  
  const sessionData = getSessionData();
  
  return (
    <>
      <PageContainer title={activeWorkout ? "Today's Workout" : "Workout Templates"}>
        <div className="space-y-8 animate-fade-in">
          {!activeWorkout ? (
            <>
              <div className={`rounded-lg p-4 mb-6 border ${getPhaseColors(currentPhase)} backdrop-blur-sm transition-all duration-300`}>
                <h2 className="text-lg font-display mb-1">
                  {currentPhase} Phase Workout Plans
                </h2>
                <p className="text-sm text-muted-foreground">
                  These workouts are optimized for your current cycle phase. Choose one to begin.
                </p>
              </div>
              <WorkoutTemplateList 
                templates={templates} 
                onStartSession={handleStartSession} 
              />
            </>
          ) : (
            <>
              {/* Display workout title without card div */}
              <div className="mb-6">
                <h2 className="text-xl font-display">{sessionData.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {sessionData.description}
                </p>
              </div>
              
              {/* Timer and buttons in one row without card div */}
              <div className="flex items-center justify-between mt-4 mb-6">
                <div className="text-2xl font-mono">{formatTime(timer)}</div>
                <WorkoutTimerDisplay 
                  timer={timer} 
                  isTimerActive={isTimerActive} 
                  formatTime={formatTime}
                  toggleTimer={toggleTimer}
                  resetTimer={resetTimer}
                />
              </div>
              
              {/* Exercise list */}
              <ExerciseList 
                exercises={workout!.exercises || []} 
                workoutId={workout!.workout_id}
                onSetComplete={toggleSetCompleted}
                onAddSet={addSetToExercise}
              />
              
              {/* Complete workout button */}
              <CompleteWorkoutButton 
                isCompleted={workout!.completed} 
                onComplete={handleCompleteWorkout}
              />
            </>
          )}
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default WorkoutPage;
