
import { Separator } from "@/components/ui/separator";

interface PersonalInfo {
  age: number;
  height: string;
  weight: string;
  trainingAge: string;
  goal: string;
}

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
}

const PersonalInfoSection = ({ personalInfo }: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg">Personal Info</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between py-3">
          <span className="text-muted-foreground">Age</span>
          <span className="font-display">{personalInfo.age}</span>
        </div>
        <Separator />
        
        <div className="flex justify-between py-3">
          <span className="text-muted-foreground">Height</span>
          <span className="font-display">{personalInfo.height}</span>
        </div>
        <Separator />
        
        <div className="flex justify-between py-3">
          <span className="text-muted-foreground">Weight</span>
          <span className="font-display">{personalInfo.weight}</span>
        </div>
        <Separator />
        
        <div className="flex justify-between py-3">
          <span className="text-muted-foreground">Training Age</span>
          <span className="font-display">{personalInfo.trainingAge}</span>
        </div>
        <Separator />
        
        <div className="flex justify-between py-3">
          <span className="text-muted-foreground">Goal</span>
          <span className="font-display">{personalInfo.goal}</span>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
