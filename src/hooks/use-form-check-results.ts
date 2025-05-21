
import { useState } from 'react';

export interface FormCheckResult {
  score: number;
  notes: string[];
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
    
    return mockResults[liftType] || mockResults.default;
  };
  
  return {
    result,
    setResult,
    getMockResultsForLiftType
  };
}
