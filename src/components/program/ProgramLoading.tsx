
import React from "react";
import { Loader2 } from "lucide-react";

const ProgramLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <div className="text-center">Loading your program...</div>
    </div>
  );
};

export default ProgramLoading;
