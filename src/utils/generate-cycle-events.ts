
/**
 * Generate cycle events by calling the Supabase Edge Function
 */
export async function generateCycleEvents(
  userId: string, 
  cycleLength: number, 
  lastPeriodDate: Date
) {
  try {
    // Use direct URL with project ID for edge function call
    const supabaseUrl = "https://sxeglgdcrfpfgtdexeje.supabase.co";
    
    const response = await fetch(`${supabaseUrl}/functions/v1/generate-cycle-events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          userId,
          cycleLength,
          lastPeriod: lastPeriodDate.toISOString(),
        }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate cycle events");
    }
    
    const result = await response.json();
    console.log("Generated cycle events:", result);
    return result;
  } catch (error: any) {
    console.error("Error generating cycle events:", error);
    throw error;
  }
}
