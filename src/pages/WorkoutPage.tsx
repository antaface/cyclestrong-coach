
import { useToast } from "@/hooks/use-toast";
import { useWorkout } from "@/hooks/use-workout";

import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import WorkoutSummaryCard from "@/components/workout/WorkoutSummaryCard";
import WorkoutTimerDisplay from "@/components/workout/WorkoutTimerDisplay";
import ExerciseList from "@/components/workout/ExerciseList";
import CompleteWorkoutButton from "@/components/workout/CompleteWorkoutButton";
import WorkoutPageLoading from "@/components/workout/WorkoutPageLoading";
import WorkoutPageError from "@/components/workout/WorkoutPageError";

const WorkoutPage = () => {
  const { toast } = useToast();
  
  // Get workout data, ideally this would come from a URL parameter
  // For now, we'll use mock data since we don't have auth set up yet
  const { 
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
  } = useWorkout(); // No ID means we get mock data for now
  
  if (isLoading) {
    return <WorkoutPageLoading />;
  }
  
  if (error || !workout) {
    return <WorkoutPageError />;
  }
  
  const handleCompleteWorkout = () => {
    completeWorkout();
    toast({
      title: "Workout completed!",
      description: "Great job! Your workout has been marked as complete.",
    });
  };

  return (
    <>
      <PageContainer title="Today's Workout">
        <div className="space-y-6">
          {/* Workout summary card with timer display */}
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <WorkoutSummaryCard workout={workout} />
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
            exercises={workout.exercises || []} 
            workoutId={workout.workout_id}
            onSetComplete={toggleSetCompleted}
          />
          
          {/* Complete workout button */}
          <CompleteWorkoutButton 
            isCompleted={workout.completed} 
            onComplete={handleCompleteWorkout}
          />
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default WorkoutPage;
