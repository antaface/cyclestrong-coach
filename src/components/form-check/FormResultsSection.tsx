
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FormCheckResultProps {
  score: number;
  notes: string[];
}

const FormResultsSection = ({ result }: { result: FormCheckResultProps | null }) => {
  if (!result) return null;
  
  return (
    <Card className="p-5 border-2 border-primary/20 bg-primary/5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Form Analysis</h2>
        <div className="bg-background px-3 py-1 rounded-full flex items-center gap-1">
          <Check className="text-primary w-4 h-4" />
          <span className="text-primary font-display font-semibold">Complete</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm text-muted-foreground">Form Score</h3>
          <span className="text-xl font-bold font-display">{result.score.toFixed(1)}/10</span>
        </div>
        
        <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${(result.score / 10) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Form Notes</h3>
        <ul className="space-y-2">
          {result.notes.map((note, index) => (
            <li key={index} className="text-sm flex items-start gap-2 p-2 bg-background rounded-md">
              <span className="bg-accent w-5 h-5 rounded-full text-xs flex items-center justify-center mt-0.5">
                {index + 1}
              </span>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default FormResultsSection;
