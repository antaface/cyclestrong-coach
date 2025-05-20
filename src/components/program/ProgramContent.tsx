
import React from "react";
import { Accordion } from "@/components/ui/accordion";
import CollapsibleProgramWeek from "@/components/program/CollapsibleProgramWeek";
import ProgramHeader from "@/components/program/ProgramHeader";
import ProgramDateCard from "@/components/program/ProgramDateCard";
import { ProgramData, Program } from "@/hooks/use-program";

interface ProgramContentProps {
  program: Program;
  isGenerating: boolean;
  onGenerateNew: () => void;
}

const ProgramContent: React.FC<ProgramContentProps> = ({ 
  program, 
  isGenerating, 
  onGenerateNew 
}) => {
  const programData = program.plan_json;
  const weeks = programData.weeks || [];

  if (!weeks.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Program structure not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProgramHeader 
        title={programData.title || "Your Training Program"} 
        description={programData.description || "4-Week Mesocycle"}
        isGenerating={isGenerating}
        onGenerate={onGenerateNew}
      />

      <Accordion type="single" collapsible className="w-full border-t border-border/30 rounded-lg overflow-hidden">
        {weeks.map((week, index) => (
          <CollapsibleProgramWeek
            key={`week-${index + 1}`}
            weekNumber={index + 1}
            theme={week.theme}
            workouts={week.workouts || []}
          />
        ))}
      </Accordion>
      
      {program.start_date && (
        <ProgramDateCard startDate={program.start_date} />
      )}
    </div>
  );
};

export default ProgramContent;
