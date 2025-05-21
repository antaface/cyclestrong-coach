
import { supabase } from "@/integrations/supabase/client";

export function useFormDatabase() {
  const saveFormReview = async (
    workoutId: string,
    exerciseName: string,
    score: number,
    issues: any[],
    videoUrl: string
  ) => {
    try {
      // Create a form review record
      const { error: insertError } = await supabase.from('form_reviews').insert({
        workout_id: workoutId,
        exercise: exerciseName,
        score: score,
        issues_json: {
          issues: issues
        },
        video_url: videoUrl
      });

      if (insertError) {
        throw insertError;
      }
      
      return true;
    } catch (error) {
      console.error('Error in database operation:', error);
      throw error;
    }
  };

  return { saveFormReview };
}
