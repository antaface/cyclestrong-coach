
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayIcon } from "lucide-react";

export interface WorkoutTemplate {
  id: string;
  phase: 'follicular' | 'ovulation' | 'luteal' | 'menstrual';
  title: string;
  description: string;
  session_json: string | any[];
}

interface WorkoutTemplateCardProps {
  template: WorkoutTemplate;
  onStartSession: (template: WorkoutTemplate) => void;
}

const WorkoutTemplateCard: React.FC<WorkoutTemplateCardProps> = ({ 
  template, 
  onStartSession 
}) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-display text-lg">{template.title}</CardTitle>
          <Badge className="capitalize">{template.phase} Phase</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onStartSession(template)}
          className="w-full"
        >
          <PlayIcon className="mr-2 h-4 w-4" /> Start Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutTemplateCard;
