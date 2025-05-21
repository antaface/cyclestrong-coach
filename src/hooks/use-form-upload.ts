
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { useFormStorage } from "@/hooks/use-form-storage";
import { useFormDatabase } from "@/hooks/use-form-database";

export function useFormUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const { uploadFormVideo } = useFormStorage();
  const { saveFormReview } = useFormDatabase();

  const uploadAndSaveForm = async (
    workoutId: string,
    exerciseName: string,
    videoFile: File,
    score: number,
    issues: any[]
  ) => {
    if (!videoFile) {
      toast({
        title: "Error",
        description: "Please select a video file to upload",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsUploading(true);

      // Upload video to storage
      const videoUrl = await uploadFormVideo(workoutId, videoFile);
      
      if (videoUrl) {
        setVideoUrl(videoUrl);
        
        try {
          // Try to save form review record, but don't block on failure
          await saveFormReview(workoutId, exerciseName, score, issues, videoUrl);
        } catch (dbError) {
          // Log the database error but continue with form analysis
          console.error('Database save error:', dbError);
          // We'll still return the video URL even if database save fails
        }

        return videoUrl;
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      console.error('Error uploading video:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    videoUrl,
    uploadAndSaveForm
  };
}
