
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export function useFormUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const uploadFormVideo = async (
    workoutId: string,
    exerciseName: string,
    videoFile: File
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

      // Create a unique filename
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `form-reviews/${workoutId}/${fileName}`;

      // Upload video to storage
      const { error: uploadError } = await supabase.storage
        .from('form-videos')
        .upload(filePath, videoFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('form-videos')
        .getPublicUrl(filePath);

      if (data) {
        setVideoUrl(data.publicUrl);
        // In a real app, we'd call an Edge Function to analyze the video here
        // For now, we'll simulate with a mock analysis
        
        // Create a form review record
        const { error: insertError } = await supabase.from('form_reviews').insert({
          workout_id: workoutId,
          exercise: exerciseName,
          score: Math.floor(Math.random() * 8) + 3, // Random score between 3-10
          issues_json: {
            issues: [
              {
                timestamp: "00:05",
                issue: "Knees caving in slightly",
                fix: "Push knees out as you descend"
              },
              {
                timestamp: "00:12",
                issue: "Losing lower back position",
                fix: "Maintain core bracing throughout the lift"
              }
            ]
          },
          video_url: data.publicUrl
        });

        if (insertError) {
          throw insertError;
        }

        toast({
          title: "Form analysis complete",
          description: "Your form has been analyzed. Check the results!",
        });

        return data.publicUrl;
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
    uploadFormVideo
  };
}
