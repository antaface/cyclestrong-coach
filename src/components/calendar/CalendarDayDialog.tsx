
import { format } from "date-fns";
import { CyclePhase } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CycleEvent {
  date: string;
  phase: CyclePhase;
}

interface CalendarDayDialogProps {
  selectedDay: Date | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  cycleEvents: CycleEvent[];
}

export const CalendarDayDialog = ({
  selectedDay,
  isDialogOpen,
  setIsDialogOpen,
  cycleEvents,
}: CalendarDayDialogProps) => {
  const getPhaseInfo = (day: Date) => {
    if (!day) return null;
    
    const formattedDate = day.toISOString().split('T')[0];
    const cycleDay = cycleEvents.find(d => d.date === formattedDate);
    
    if (!cycleDay) return null;
    
    const phaseInfo = {
      [CyclePhase.FOLLICULAR]: {
        title: "Follicular Phase",
        description: "Your estrogen levels are rising. This is a great time for high-intensity workouts and building strength.",
        trainingTip: "Focus on progressive overload. You might feel stronger than usual, so challenge yourself with heavier weights or more challenging variations."
      },
      [CyclePhase.OVULATION]: {
        title: "Ovulation Phase",
        description: "Your estrogen peaks and testosterone slightly increases. Your energy and strength are typically at their highest.",
        trainingTip: "Excellent time for personal records and high-intensity training. Take advantage of your peak strength and coordination."
      },
      [CyclePhase.LUTEAL]: {
        title: "Luteal Phase",
        description: "Progesterone rises while estrogen drops. You may notice decreased energy and increased body temperature.",
        trainingTip: "Focus on moderate volume work. Emphasize technique and consider reducing weight slightly if needed. Good time for deload."
      },
      [CyclePhase.MENSTRUAL]: {
        title: "Menstrual Phase",
        description: "Hormone levels are at their lowest. Energy levels vary widely between individuals.",
        trainingTip: "Listen to your body. Consider active recovery or lighter workouts if you experience discomfort. Still, many women find strength training beneficial for reducing symptoms."
      }
    };
    
    return phaseInfo[cycleDay.phase];
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {selectedDay && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {format(selectedDay, "EEEE, MMMM d")}
            </DialogTitle>
            <DialogDescription>
              {getPhaseInfo(selectedDay)?.title || "Outside tracked cycle"}
            </DialogDescription>
          </DialogHeader>
          
          {getPhaseInfo(selectedDay) ? (
            <div className="space-y-4">
              <p className="text-sm text-cs-neutral-600">
                {getPhaseInfo(selectedDay)?.description}
              </p>
              
              <div className="bg-cs-neutral-100 p-3 rounded-md">
                <p className="font-medium text-cs-neutral-900 mb-1">Training Tip</p>
                <p className="text-sm text-cs-neutral-600">
                  {getPhaseInfo(selectedDay)?.trainingTip}
                </p>
              </div>
              
              <div>
                <p className="font-medium text-cs-neutral-900 mb-1">Recommended Focus</p>
                <div className="flex gap-2">
                  {getPhaseInfo(selectedDay)?.title === "Follicular Phase" && (
                    <>
                      <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Strength</span>
                      <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Power</span>
                      <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">High Intensity</span>
                    </>
                  )}
                  {getPhaseInfo(selectedDay)?.title === "Ovulation Phase" && (
                    <>
                      <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Max Strength</span>
                      <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">PRs</span>
                      <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Power</span>
                    </>
                  )}
                  {getPhaseInfo(selectedDay)?.title === "Luteal Phase" && (
                    <>
                      <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Technique</span>
                      <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Moderate Volume</span>
                      <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Deload</span>
                    </>
                  )}
                  {getPhaseInfo(selectedDay)?.title === "Menstrual Phase" && (
                    <>
                      <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Recovery</span>
                      <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Light Activity</span>
                      <span className="bg-cs-purple/10 text-cs-purple text-xs px-2 py-1 rounded-full">Mobility</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-cs-neutral-600">
              This date is outside your tracked cycle. Update your cycle information to see recommendations for this day.
            </p>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};
