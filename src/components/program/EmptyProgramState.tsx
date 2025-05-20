
import React from "react";
import { Button } from "@/components/ui/button";
import { Dumbbell, Loader2 } from "lucide-react";

interface EmptyProgramStateProps {
  isGenerating: boolean;
  onGenerate: () => void;
}

const EmptyProgramState: React.FC<EmptyProgramStateProps> = ({ 
  isGenerating, 
  onGenerate 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <Dumbbell className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No Program Found</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        You don't have a training program yet. Generate a personalized 4-week 
        mesocycle based on your profile data.
      </p>
      <Button 
        onClick={onGenerate} 
        disabled={isGenerating}
        className="min-w-[180px]"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Generating...
          </>
        ) : "Generate My Program"}
      </Button>
    </div>
  );
};

export default EmptyProgramState;
