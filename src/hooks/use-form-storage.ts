
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export function useFormStorage() {
  const uploadFormVideo = async (
    workoutId: string,
    videoFile: File
  ): Promise<string | null> => {
    try {
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
        return data.publicUrl;
      }
      
      return null;
    } catch (error) {
      console.error('Error in storage operation:', error);
      throw error;
    }
  };

  return { uploadFormVideo };
}
