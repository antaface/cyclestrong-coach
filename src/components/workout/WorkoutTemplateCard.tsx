
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
  index?: number;
}

const WorkoutTemplateCard: React.FC<WorkoutTemplateCardProps> = ({ 
  template, 
  onStartSession,
  index = 0
}) => {
  // Helper function to get phase-specific colors
  const getPhaseColors = (phase: string) => {
    switch(phase) {
      case 'menstrual':
        return 'bg-joyful-clay/80 text-white';
      case 'follicular':
        return 'bg-joyful-coral text-white';
      case 'ovulation':
        return 'bg-joyful-orange text-white';
      case 'luteal':
        return 'bg-joyful-peach text-joyful-clay';
      default:
        return 'bg-muted text-foreground';
    }
  };

  return (
    <Card 
      className="mb-4 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fade-in opacity-0" 
      style={{ 
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'forwards'
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="font-display text-lg">{template.title}</CardTitle>
          <Badge className={`capitalize ${getPhaseColors(template.phase)}`}>
            {template.phase} Phase
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onStartSession(template)}
          className="w-full hover:scale-[1.02] transition-transform duration-200"
        >
          <PlayIcon className="mr-2 h-4 w-4" /> Start Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutTemplateCard;
