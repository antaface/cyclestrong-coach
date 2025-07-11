
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CycleData {
  userId: string;
  cycleLength: number;
  lastPeriod: string; // ISO string format
}

enum CyclePhase {
  FOLLICULAR = "follicular",
  OVULATION = "ovulation",
  LUTEAL = "luteal",
  MENSTRUAL = "menstrual"
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const { data: cycleData } = await req.json() as { data: CycleData };
    const { userId, cycleLength, lastPeriod } = cycleData;
    
    if (!userId || !cycleLength || !lastPeriod) {
      return new Response(
        JSON.stringify({ error: 'Missing required data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate phases for the next 90 days
    const events = generateCycleEvents(userId, new Date(lastPeriod), cycleLength, 90);
    
    // Insert events into the database using service role
    const { data, error } = await supabase
      .from('cycle_events')
      .insert(events);

    if (error) {
      console.error("Error inserting cycle events:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, count: events.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in generate-cycle-events function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateCycleEvents(userId: string, lastPeriodDate: Date, cycleLength: number, daysToGenerate: number) {
  const events = [];
  
  // Standard phase lengths (can be customized based on cycle length)
  const menstrualPhaseLength = 5;
  const follicularPhaseLength = Math.floor((cycleLength - menstrualPhaseLength) / 2) - 2;
  const ovulationPhaseLength = 4;
  const lutealPhaseLength = cycleLength - menstrualPhaseLength - follicularPhaseLength - ovulationPhaseLength;
  
  let currentDate = new Date(lastPeriodDate);
  let daysGenerated = 0;
  
  while (daysGenerated < daysToGenerate) {
    // Menstrual phase
    for (let i = 0; i < menstrualPhaseLength && daysGenerated < daysToGenerate; i++) {
      events.push({
        user_id: userId,
        date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD format
        phase: CyclePhase.MENSTRUAL,
      });
      currentDate = addDays(currentDate, 1);
      daysGenerated++;
    }
    
    // Follicular phase
    for (let i = 0; i < follicularPhaseLength && daysGenerated < daysToGenerate; i++) {
      events.push({
        user_id: userId,
        date: currentDate.toISOString().split('T')[0],
        phase: CyclePhase.FOLLICULAR,
      });
      currentDate = addDays(currentDate, 1);
      daysGenerated++;
    }
    
    // Ovulation phase
    for (let i = 0; i < ovulationPhaseLength && daysGenerated < daysToGenerate; i++) {
      events.push({
        user_id: userId,
        date: currentDate.toISOString().split('T')[0],
        phase: CyclePhase.OVULATION,
      });
      currentDate = addDays(currentDate, 1);
      daysGenerated++;
    }
    
    // Luteal phase
    for (let i = 0; i < lutealPhaseLength && daysGenerated < daysToGenerate; i++) {
      events.push({
        user_id: userId,
        date: currentDate.toISOString().split('T')[0],
        phase: CyclePhase.LUTEAL,
      });
      currentDate = addDays(currentDate, 1);
      daysGenerated++;
    }
  }
  
  return events;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
