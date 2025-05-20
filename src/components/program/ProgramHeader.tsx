
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProgramHeaderProps {
  title: string;
  description: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

const ProgramHeader: React.FC<ProgramHeaderProps> = ({
  title,
  description,
  isGenerating,
  onGenerate
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">{title || "Your Training Program"}</h1>
        <p className="text-muted-foreground mt-1">{description || "4-Week Mesocycle"}</p>
      </div>
      <Button 
        variant="outline" 
        onClick={onGenerate} 
        disabled={isGenerating}
        size="sm"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Generating...
          </>
        ) : "Generate New Program"}
      </Button>
    </div>
  );
};

export default ProgramHeader;
