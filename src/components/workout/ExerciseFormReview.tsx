
import { useState } from "react";
import { Video, Clock } from "lucide-react";
import { WorkoutExercise } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFormUpload } from "@/hooks/use-form-upload";

interface ExerciseFormReviewProps {
  exercise: WorkoutExercise;
  workoutId: string;
}

const ExerciseFormReview = ({ exercise, workoutId }: ExerciseFormReviewProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const { isUploading, videoUrl, uploadFormVideo } = useFormUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!videoFile) return;
    uploadFormVideo(workoutId, exercise.name, videoFile);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{exercise.name} Form Check</DialogTitle>
        <DialogDescription>
          Upload a video of your lift for AI form analysis
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="video">Video File</Label>
          <Input
            id="video" 
            type="file" 
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>
        
        {videoFile && (
          <div className="bg-cs-neutral-100 p-3 rounded-md">
            <p className="text-sm text-cs-neutral-900 mb-1">Selected file:</p>
            <p className="text-xs text-cs-neutral-600">{videoFile.name}</p>
          </div>
        )}
        
        <Button 
          className="w-full bg-cs-purple hover:bg-cs-purple-dark"
          disabled={!videoFile || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? "Uploading..." : "Upload and Analyze Form"}
        </Button>
        
        <div className="bg-cs-neutral-100 p-3 rounded-md">
          <p className="text-sm font-medium text-cs-neutral-900 mb-1">How it works:</p>
          <ol className="text-xs text-cs-neutral-600 list-decimal list-inside space-y-1">
            <li>Record a video of your lift from the side view</li>
            <li>Upload the video for AI analysis</li>
            <li>Get a form score and specific feedback</li>
            <li>Apply the feedback to improve your technique</li>
          </ol>
        </div>
      </div>
    </DialogContent>
  );
};

export default ExerciseFormReview;
