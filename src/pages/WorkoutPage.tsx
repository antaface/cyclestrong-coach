
import { useState } from "react";
import { Plus, ChevronRight, Check, Video, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";
import { WorkoutExercise } from "@/types";

// Mock workout data
const mockWorkout = {
  id: "workout-1",
  name: "Lower Body Strength - Follicular Phase",
  description: "Focus on progressive overload and challenging yourself with heavier weights",
  date: new Date(),
  exercises: [
    {
      id: "ex1",
      name: "Back Squat",
      sets: [
        { weight: 80, reps: 5, rir: 2, completed: false },
        { weight: 85, reps: 5, rir: 2, completed: false },
        { weight: 90, reps: 5, rir: 2, completed: false },
      ],
      notes: "Focus on depth and keeping chest up"
    },
    {
      id: "ex2",
      name: "Romanian Deadlift",
      sets: [
        { weight: 70, reps: 8, rir: 2, completed: false },
        { weight: 70, reps: 8, rir: 2, completed: false },
        { weight: 70, reps: 8, rir: 2, completed: false },
      ],
      notes: "Maintain neutral spine, feel stretch in hamstrings"
    },
    {
      id: "ex3",
      name: "Hip Thrust",
      sets: [
        { weight: 100, reps: 10, rir: 2, completed: false },
        { weight: 100, reps: 10, rir: 2, completed: false },
        { weight: 100, reps: 10, rir: 2, completed: false },
      ]
    },
    {
      id: "ex4",
      name: "Walking Lunges",
      sets: [
        { weight: 20, reps: 12, rir: 1, completed: false },
        { weight: 20, reps: 12, rir: 1, completed: false }
      ]
    },
    {
      id: "ex5",
      name: "Calf Raises",
      sets: [
        { weight: 40, reps: 15, rir: 1, completed: false },
        { weight: 40, reps: 15, rir: 1, completed: false },
        { weight: 40, reps: 15, rir: 1, completed: false },
      ]
    }
  ]
};

// Exercise form review modal
const ExerciseFormReview = ({ exercise }: { exercise: WorkoutExercise }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!videoFile) return;
    
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      // In a real app, this would call an API to analyze the video
    }, 2000);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{exercise.name} Form Check</DialogTitle>
        <DialogDescription>
          Upload a video of your lift for AI form analysis
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="video">Video File</Label>
          <Input
            id="video" 
            type="file" 
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>
        
        {videoFile && (
          <div className="bg-cs-neutral-100 p-3 rounded-md">
            <p className="text-sm text-cs-neutral-900 mb-1">Selected file:</p>
            <p className="text-xs text-cs-neutral-600">{videoFile.name}</p>
          </div>
        )}
        
        <Button 
          className="w-full bg-cs-purple hover:bg-cs-purple-dark"
          disabled={!videoFile || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? "Uploading..." : "Upload and Analyze Form"}
        </Button>
        
        <div className="bg-cs-neutral-100 p-3 rounded-md">
          <p className="text-sm font-medium text-cs-neutral-900 mb-1">How it works:</p>
          <ol className="text-xs text-cs-neutral-600 list-decimal list-inside space-y-1">
            <li>Record a video of your lift from the side view</li>
            <li>Upload the video for AI analysis</li>
            <li>Get a form score and specific feedback</li>
            <li>Apply the feedback to improve your technique</li>
          </ol>
        </div>
      </div>
    </DialogContent>
  );
};

const WorkoutPage = () => {
  const [workout, setWorkout] = useState(mockWorkout);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null);
  
  // Handle set completion
  const toggleSetCompleted = (exerciseIndex: number, setIndex: number) => {
    const updatedWorkout = { ...workout };
    const set = updatedWorkout.exercises[exerciseIndex].sets[setIndex];
    set.completed = !set.completed;
    setWorkout(updatedWorkout);
  };
  
  // Timer controls
  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };
  
  const resetTimer = () => {
    setTimer(0);
    setIsTimerActive(false);
  };
  
  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                  <h2 className="font-medium text-lg">{workout.name}</h2>
                  <p className="text-sm text-cs-neutral-600">
                    {workout.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-cs-purple">Follicular Phase</Badge>
                    <Badge variant="outline" className="text-cs-neutral-600 border-cs-neutral-300">
                      Cycle Day 10
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
            {workout.exercises.map((exercise, exerciseIndex) => (
              <Card key={exercise.id}>
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{exercise.name}</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 border-cs-purple text-cs-purple hover:bg-cs-purple/10"
                            onClick={() => setSelectedExercise(exercise)}
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Form
                          </Button>
                        </DialogTrigger>
                        <ExerciseFormReview exercise={exercise} />
                      </Dialog>
                    </div>
                    
                    {exercise.notes && (
                      <p className="text-xs text-cs-neutral-500 mt-1">
                        {exercise.notes}
                      </p>
                    )}
                    
                    <div className="mt-3">
                      <div className="grid grid-cols-12 gap-1 text-xs text-cs-neutral-500 mb-1">
                        <div className="col-span-1">#</div>
                        <div className="col-span-3">Weight</div>
                        <div className="col-span-2">Reps</div>
                        <div className="col-span-2">RIR</div>
                        <div className="col-span-4">Done</div>
                      </div>
                      
                      {exercise.sets.map((set, setIndex) => (
                        <div 
                          key={`${exercise.id}-set-${setIndex}`}
                          className={cn(
                            "grid grid-cols-12 gap-1 py-2 items-center text-sm border-t border-gray-100",
                            set.completed && "bg-cs-neutral-100"
                          )}
                        >
                          <div className="col-span-1 font-medium">{setIndex + 1}</div>
                          <div className="col-span-3">{set.weight} kg</div>
                          <div className="col-span-2">{set.reps}</div>
                          <div className="col-span-2">{set.rir}</div>
                          <div className="col-span-4">
                            <Button
                              variant={set.completed ? "default" : "outline"}
                              size="sm"
                              className={cn(
                                "h-8 w-16",
                                set.completed ? 
                                  "bg-cs-purple hover:bg-cs-purple-dark" : 
                                  "border-cs-purple text-cs-purple hover:bg-cs-purple/10"
                              )}
                              onClick={() => toggleSetCompleted(exerciseIndex, setIndex)}
                            >
                              {set.completed ? (
                                <>
                                  <Check className="w-4 h-4 mr-1" /> Done
                                </>
                              ) : (
                                "Mark"
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
            <Button className="w-full bg-cs-purple hover:bg-cs-purple-dark">
              Complete Workout
            </Button>
          </div>
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default WorkoutPage;
