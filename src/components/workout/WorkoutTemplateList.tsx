
import WorkoutTemplateCard, { WorkoutTemplate } from "./WorkoutTemplateCard";

interface WorkoutTemplateListProps {
  templates: WorkoutTemplate[];
  onStartSession: (template: WorkoutTemplate) => void;
}

const WorkoutTemplateList: React.FC<WorkoutTemplateListProps> = ({ 
  templates, 
  onStartSession 
}) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground animate-fade-in">
        No workout templates available for your current phase.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {templates.map((template, index) => (
        <WorkoutTemplateCard
          key={template.id}
          template={template}
          onStartSession={onStartSession}
          index={index}
        />
      ))}
    </div>
  );
};

export default WorkoutTemplateList;
