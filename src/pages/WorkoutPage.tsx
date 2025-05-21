
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
import WorkoutSummaryCard from "@/components/workout/WorkoutSummaryCard";
import ExerciseList from "@/components/workout/ExerciseList";
import CompleteWorkoutButton from "@/components/workout/CompleteWorkoutButton";

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
    completeWorkout
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

  if (phaseLoading || workoutLoading) {
    return <WorkoutPageLoading />;
  }
  
  if (error && activeWorkout) {
    return <WorkoutPageError />;
  }
  
  return (
    <>
      <PageContainer title={activeWorkout ? "Today's Workout" : "Workout Templates"}>
        <div className="space-y-8">
          {!activeWorkout ? (
            <>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 mb-6">
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
              {/* Display active workout */}
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <WorkoutSummaryCard workout={workout!} />
                </div>
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
