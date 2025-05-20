
import { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWorkout } from "@/hooks/use-workout";

import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import WorkoutExerciseCard from "@/components/workout/WorkoutExerciseCard";

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
    return (
      <PageContainer title="Loading workout...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cs-purple"></div>
        </div>
      </PageContainer>
    );
  }
  
  if (error || !workout) {
    return (
      <PageContainer title="Error">
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">Could not load workout</h2>
          <p className="text-cs-neutral-600">Please try again later</p>
        </div>
      </PageContainer>
    );
  }
  
  // Extract workout details
  const workoutDetails = workout.session_json ? 
    (typeof workout.session_json === 'string' ? 
      JSON.parse(workout.session_json) : 
      workout.session_json) : 
    {};
  
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
          {/* Workout summary card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-medium text-lg">{workoutDetails.name || 'Today\'s Workout'}</h2>
                  <p className="text-sm text-cs-neutral-600">
                    {workoutDetails.description || 'Complete your workout for today'}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-cs-purple capitalize">{workout.phase} Phase</Badge>
                    <Badge variant="outline" className="text-cs-neutral-600 border-cs-neutral-300">
                      Cycle Day {/* Would calculate from profile data */}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-center bg-cs-neutral-100 px-3 py-2 rounded-lg">
                    <span className="text-lg font-mono font-medium">{formatTime(timer)}</span>
                    <div className="flex gap-1 mt-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-8 p-0"
                        onClick={toggleTimer}
                      >
                        {isTimerActive ? "⏸" : "▶️"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-8 p-0"
                        onClick={resetTimer}
                      >
                        🔄
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Exercise list */}
          <div className="space-y-4">
            {workout.exercises && workout.exercises.map((exercise, exerciseIndex) => (
              <WorkoutExerciseCard
                key={exercise.id}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                workoutId={workout.workout_id}
                onSetComplete={toggleSetCompleted}
              />
            ))}
          </div>
          
          {/* Add exercise button */}
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              className="border-dashed border-cs-neutral-300 text-cs-neutral-500"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Exercise
            </Button>
          </div>
          
          {/* Complete workout button */}
          <div className="pt-4">
            <Button 
              className="w-full bg-cs-purple hover:bg-cs-purple-dark"
              disabled={workout.completed}
              onClick={handleCompleteWorkout}
            >
              {workout.completed ? "Workout Completed" : "Complete Workout"}
            </Button>
          </div>
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default WorkoutPage;
