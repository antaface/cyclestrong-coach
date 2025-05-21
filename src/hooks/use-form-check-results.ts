
import { useState } from 'react';

export interface FormCheckResult {
  score: number;
  notes: string[];
  videoUrl?: string;
}

export function useFormCheckResults() {
  const [result, setResult] = useState<FormCheckResult | null>(null);
  
  const getMockResultsForLiftType = (liftType: string): FormCheckResult => {
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
      "Overhead Press": {
        score: 7.2,
        notes: [
          "Slight overextension of the lower back",
          "Elbows need to track forward more",
          "Good bar path over midline"
        ]
      },
      "Pull-up": {
        score: 6.8,
        notes: [
          "Not reaching full extension at the bottom",
          "Good scapular engagement at the top",
          "Work on reducing body swing during reps"
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
    
    // Ensure we return a valid result even if the lift type is not found
    const result = mockResults[liftType] || mockResults.default;
    
    // Ensure notes is always an array
    if (!Array.isArray(result.notes)) {
      result.notes = [];
    }
    
    return result;
  };
  
  return {
    result,
    setResult,
    getMockResultsForLiftType
  };
}
