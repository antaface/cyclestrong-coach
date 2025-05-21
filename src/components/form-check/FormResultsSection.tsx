
import { AlertTriangle, Check, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FormCheckResultProps {
  score: number;
  notes: string[];
  videoUrl?: string;
}

const FormResultsSection = ({ result }: { result: FormCheckResultProps | null }) => {
  if (!result) return null;
  
  // Get icon based on score
  const getScoreIcon = () => {
    if (result.score >= 8) return <Check className="text-green-500 w-5 h-5" />;
    if (result.score >= 6) return <Info className="text-amber-500 w-5 h-5" />;
    return <AlertTriangle className="text-red-500 w-5 h-5" />;
  };
  
  return (
    <div className="space-y-6">
      {result.videoUrl && (
        <Card className="overflow-hidden">
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <video 
              src={result.videoUrl} 
              controls
              className="w-full h-full object-cover"
              poster="/placeholder.svg"
            />
          </div>
        </Card>
      )}
    
      <Card className="border-2 border-primary/20 bg-[#FDE1D3]/40 rounded-xl overflow-hidden">
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Form Analysis</h2>
            <div className="bg-background px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Check className="text-primary w-4 h-4" />
              <span className="text-primary font-display font-semibold">Complete</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex flex-col mb-3">
              <h3 className="font-medium text-sm text-muted-foreground">Form Score</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold font-display">{result.score.toFixed(1)}</span>
                <span className="text-lg text-muted-foreground">/10</span>
                {getScoreIcon()}
              </div>
            </div>
            
            <div className="w-full h-2 bg-accent/50 rounded-full overflow-hidden">
              <div 
                className={`h-full ${result.score >= 8 ? 'bg-green-500' : result.score >= 6 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${(result.score / 10) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Form Notes</h3>
            <div className="space-y-3">
              {result.notes && result.notes.map((note, index) => (
                <Card key={index} className="bg-white/80 shadow-sm p-3 border-none">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <p className="text-sm leading-tight">{note}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormResultsSection;
