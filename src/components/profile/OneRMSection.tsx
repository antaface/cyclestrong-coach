
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OneRMSectionProps {
  oneRM: Record<string, number>;
}

const OneRMSection = ({ oneRM }: OneRMSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg">Your One-Rep Maximums</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between py-3">
          <span className="text-muted-foreground">Squat</span>
          <span className="font-display">{oneRM.squat} kg</span>
        </div>
        <Separator />
        
        <div className="flex justify-between py-3">
          <span className="text-muted-foreground">Bench Press</span>
          <span className="font-display">{oneRM.bench} kg</span>
        </div>
        <Separator />
        
        <div className="flex justify-between py-3">
          <span className="text-muted-foreground">Deadlift</span>
          <span className="font-display">{oneRM.deadlift} kg</span>
        </div>
        <Separator />
        
        <div className="flex justify-between py-3">
          <span className="text-muted-foreground">Hip Thrust</span>
          <span className="font-display">{oneRM.hipThrust} kg</span>
        </div>
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full mt-4">
            Update 1RMs
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Your Strength Stats</DialogTitle>
            <DialogDescription>
              Enter your latest one-rep maximums to keep your training program up to date
            </DialogDescription>
          </DialogHeader>
          {/* Form would go here in a real implementation */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OneRMSection;
