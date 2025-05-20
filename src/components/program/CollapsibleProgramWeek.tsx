
import React from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Exercise {
  name: string;
  sets: number;
  reps: string | number;
  intensity?: string;
  notes?: string;
}

interface Workout {
  day: number;
  focus: string;
  notes?: string;
  exercises: Exercise[];
}

interface ProgramWeekProps {
  weekNumber: number;
  theme?: string;
  workouts: Workout[];
}

const CollapsibleProgramWeek: React.FC<ProgramWeekProps> = ({ 
  weekNumber,
  theme,
  workouts 
}) => {
  return (
    <AccordionItem value={`week-${weekNumber}`} className="border-b border-border/30">
      <AccordionTrigger className="py-4 px-1 hover:no-underline">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 bg-primary/10 p-2 rounded-md">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-display text-lg">Week {weekNumber}</div>
              {theme && <div className="text-sm text-muted-foreground">{theme}</div>}
            </div>
          </div>
          <div className="text-sm text-muted-foreground mr-2">
            {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-2 pt-1">
        <div className="space-y-4">
          {workouts.map((workout, index) => (
            <Card key={`workout-${weekNumber}-${index}`} className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary/20 to-secondary/20 h-1.5" />
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2 flex items-center">
                  Day {workout.day}: {workout.focus}
                </CardTitle>
                {workout.notes && (
                  <CardDescription className="mb-3">{workout.notes}</CardDescription>
                )}
                <Separator className="my-3" />
                <div className="space-y-3">
                  {workout.exercises.map((exercise, i) => (
                    <div key={`exercise-${i}`} className="border-b border-border/20 last:border-0 pb-2 last:pb-0">
                      <div className="font-medium">{exercise.name}</div>
                      <div className="flex justify-between mt-1">
                        <div className="text-sm">
                          <span className="bg-accent/30 text-accent-foreground px-2 py-0.5 rounded-md">
                            {exercise.sets} sets × {exercise.reps} reps
                          </span>
                          {exercise.intensity && (
                            <span className="ml-2 text-muted-foreground">
                              @ {exercise.intensity}
                            </span>
                          )}
                        </div>
                      </div>
                      {exercise.notes && (
                        <div className="italic text-sm text-muted-foreground mt-1">
                          {exercise.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CollapsibleProgramWeek;
