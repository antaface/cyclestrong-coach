
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useFormUpload } from "@/hooks/use-form-upload";
import { v4 as uuidv4 } from 'uuid';

interface FormCheckResult {
  score: number;
  notes: string[];
}

const FormCheckPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exerciseName, workoutId } = location.state || { exerciseName: "Exercise", workoutId: "" };
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [liftType, setLiftType] = useState(exerciseName || "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FormCheckResult | null>(null);
  const { isUploading, uploadFormVideo } = useFormUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      // Reset results when a new file is selected
      setResult(null);
    }
  };

  const handleCheckForm = async () => {
    if (!videoFile || !liftType) return;
    
    setIsAnalyzing(true);
    
    // Generate a mock workout ID if one wasn't provided
    const mockWorkoutId = workoutId || uuidv4();
    
    try {
      // Upload the video and save form review data
      await uploadFormVideo(mockWorkoutId, liftType, videoFile);
      
      // Set mock results
      const mockResults: Record<string, FormCheckResult> = {
        "Squat": {
          score: 7.5,
          notes: [
            "Knees caving inward slightly on rep 2 and 4",
            "Good depth achieved on all reps",
            "Try to maintain a more neutral spine position"
          ]
        },
        "Deadlift": {
          score: 8.0,
          notes: [
            "Back slightly rounded at the bottom of the lift",
            "Bar path is good and vertical",
            "Consider slowing down the descent for more control"
          ]
        },
        "Bench Press": {
          score: 6.5,
          notes: [
            "Uneven bar path - right side is lifting faster",
            "Elbows flaring out too much",
            "Good chest expansion at the bottom of the movement"
          ]
        },
        "RDL": {
          score: 7.8,
          notes: [
            "Hips rising slightly before shoulders on heavy reps",
            "Good hamstring engagement", 
            "Try to keep the bar closer to your legs throughout the movement"
          ]
        },
        // Default fallback for any other exercise
        "default": {
          score: 7.0,
          notes: [
            "Some form issues detected - review video",
            "Good overall movement pattern",
            "Work on maintaining tension throughout the lift"
          ]
        }
      };
      
      // Get results specific to the lift type or use default
      setResult(mockResults[liftType] || mockResults.default);
    } catch (error) {
      console.error("Error during form check:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <PageContainer title="Form Check" showBackButton>
        <div className="space-y-6">
          {/* Upload Section */}
          <Card className="p-5">
            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="video">Upload Video</Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </div>
              
              {videoFile && (
                <div className="bg-accent/20 p-3 rounded-md">
                  <p className="text-sm text-foreground font-medium mb-1">Selected file:</p>
                  <p className="text-xs text-muted-foreground">{videoFile.name}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="lift-type">Lift Type</Label>
                <Select 
                  value={liftType} 
                  onValueChange={setLiftType}
                >
                  <SelectTrigger id="lift-type" className="w-full">
                    <SelectValue placeholder="Select lift type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Squat">Squat</SelectItem>
                    <SelectItem value="Deadlift">Deadlift</SelectItem>
                    <SelectItem value="Bench Press">Bench Press</SelectItem>
                    <SelectItem value="RDL">Romanian Deadlift (RDL)</SelectItem>
                    <SelectItem value="Overhead Press">Overhead Press</SelectItem>
                    <SelectItem value="Pull-up">Pull-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full"
                disabled={!videoFile || !liftType || isAnalyzing || isUploading}
                onClick={handleCheckForm}
              >
                {isAnalyzing || isUploading ? "Processing..." : "Check Form"}
              </Button>
            </div>
          </Card>
          
          {/* Results Section */}
          {result && (
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
          )}
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default FormCheckPage;
