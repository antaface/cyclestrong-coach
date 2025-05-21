
import { useWorkoutTimer } from './use-workout-timer';
import { useWorkoutData } from './use-workout-data';
import { useWorkoutActions } from './use-workout-actions';

export function useWorkout(workoutId?: string) {
  // Get timer functionality
  const { timer, isTimerActive, toggleTimer, resetTimer, formatTime } = useWorkoutTimer();
  
  // Get workout data
  const { workout, isLoading, error } = useWorkoutData(workoutId);
  
  // Get workout actions
  const { toggleSetCompleted: toggleSetCompletedAction, addSetToExercise: addSetToExerciseAction, completeWorkout: completeWorkoutAction } = useWorkoutActions(workoutId);

  // Wrapper functions to pass workout data to actions
  const handleToggleSetCompleted = (exerciseIndex: number, setIndex: number) => {
    toggleSetCompletedAction(workout, exerciseIndex, setIndex);
  };

  const handleAddSetToExercise = (exerciseIndex: number) => {
    addSetToExerciseAction(workout, exerciseIndex);
  };

  const handleCompleteWorkout = () => {
    completeWorkoutAction(workout);
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
    toggleSetCompleted: handleToggleSetCompleted,
    completeWorkout: handleCompleteWorkout,
    addSetToExercise: handleAddSetToExercise
  };
}
