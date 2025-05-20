
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the JWT token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header missing' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Get the request data
    const { data } = await req.json();
    const { userId, profile } = data;
    
    console.log("Generating program for user:", userId);
    console.log("User profile:", profile);
    
    if (!userId || !profile) {
      return new Response(JSON.stringify({ error: 'Missing required user data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Generate a 4-week mesocycle based on user profile data
    const program = generateProgram(profile);
    
    // Save the generated program to the database
    const { error: saveError } = await supabaseClient
      .from('programs')
      .insert({
        user_id: userId,
        plan_json: program,
        start_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      });
    
    if (saveError) {
      throw saveError;
    }
    
    return new Response(JSON.stringify({ success: true, program }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in generate-program function:', error);
    
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Function to generate a 4-week training program based on user profile
function generateProgram(profile: any) {
  const { goal, training_age, cycle_length, one_rm } = profile;
  
  // Map training age to a difficulty level
  const difficultyByTrainingAge: Record<string, number> = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3
  };
  
  const difficulty = difficultyByTrainingAge[training_age] || 1;
  
  // Create a 4-week mesocycle with different phases
  const weeks = [];
  
  // Define exercise selection based on goals and available strength data
  const hasOneRmData = one_rm && Object.values(one_rm).some(val => val !== null && val !== 0);
  
  // Default exercises if no 1RM data available
  let primaryExercises = ['Squat', 'Bench Press', 'Deadlift', 'Hip Thrust'];
  let secondaryExercises = ['Lunges', 'Dumbbell Press', 'Romanian Deadlift', 'Glute Bridge'];
  let accessoryExercises = ['Leg Extension', 'Lat Pulldown', 'Bicep Curl', 'Tricep Extension'];
  
  // If 1RM data is available, prioritize exercises with known values
  if (hasOneRmData) {
    primaryExercises = [];
    
    if (one_rm.squat) primaryExercises.push('Squat');
    if (one_rm.bench) primaryExercises.push('Bench Press');
    if (one_rm.deadlift) primaryExercises.push('Deadlift');
    if (one_rm.hip_thrust) primaryExercises.push('Hip Thrust');
    
    // Add default exercises if user doesn't have enough 1RM data
    if (primaryExercises.length < 3) {
      ['Squat', 'Bench Press', 'Deadlift', 'Hip Thrust'].forEach(exercise => {
        if (!primaryExercises.includes(exercise)) {
          primaryExercises.push(exercise);
          if (primaryExercises.length >= 3) return;
        }
      });
    }
  }
  
  // Generate the 4-week program
  for (let week = 1; week <= 4; week++) {
    const workouts = [];
    
    // Determine number of workouts per week based on training age
    const workoutsPerWeek = Math.min(3 + difficulty, 5);
    
    for (let day = 1; day <= workoutsPerWeek; day++) {
      // Weekly progression - increase intensity each week
      const intensityFactor = 0.7 + (week * 0.05);
      
      // Focus on different body parts for different days
      let focus = 'Full Body';
      if (workoutsPerWeek >= 4) {
        switch (day) {
          case 1: focus = 'Lower Body'; break;
          case 2: focus = 'Upper Body'; break;
          case 3: focus = 'Lower Body'; break;
          case 4: focus = 'Upper Body'; break;
          case 5: focus = 'Full Body'; break;
        }
      } else if (workoutsPerWeek === 3) {
        switch (day) {
          case 1: focus = 'Lower Body'; break;
          case 2: focus = 'Upper Body'; break;
          case 3: focus = 'Full Body'; break;
        }
      }
      
      // Select exercises based on focus
      const exercises = selectExercises(focus, primaryExercises, secondaryExercises, accessoryExercises);
      
      // Create workout structure
      const workout = {
        day: day,
        focus: focus,
        exercises: exercises.map(exercise => {
          // Calculate sets and reps based on week progression and training age
          const sets = Math.min(3 + Math.floor(difficulty / 2) + Math.floor((week - 1) / 2), 5);
          let reps = 12 - (week * 2);
          
          // Adjust rep range for certain exercises
          if (exercise.includes('Deadlift')) {
            reps = Math.max(reps - 2, 4);
          }
          
          return {
            name: exercise,
            sets: sets,
            reps: reps,
            intensity: `${Math.round(intensityFactor * 100)}% of 1RM`,
            notes: week === 4 ? "Push for a new PR!" : "Focus on form and control"
          };
        })
      };
      
      workouts.push(workout);
    }
    
    weeks.push({
      week: week,
      theme: week === 4 ? "Peak Intensity" : `Progressive Overload - Week ${week}`,
      workouts: workouts
    });
  }
  
  return {
    title: `${goal.charAt(0).toUpperCase() + goal.slice(1)} Focus 4-Week Program`,
    description: `Personalized 4-week training program focused on ${goal} for a ${training_age} lifter`,
    start_date: new Date().toISOString().split('T')[0],
    weeks: weeks
  };
}

// Helper function to select exercises based on the day's focus
function selectExercises(
  focus: string,
  primaryExercises: string[],
  secondaryExercises: string[],
  accessoryExercises: string[]
): string[] {
  let selectedExercises: string[] = [];
  
  // Shuffle exercises to create variety
  const shuffled = {
    primary: [...primaryExercises].sort(() => 0.5 - Math.random()),
    secondary: [...secondaryExercises].sort(() => 0.5 - Math.random()),
    accessory: [...accessoryExercises].sort(() => 0.5 - Math.random())
  };
  
  switch (focus) {
    case 'Lower Body':
      selectedExercises = [
        shuffled.primary.find(e => e.includes('Squat') || e.includes('Deadlift') || e.includes('Hip')) || shuffled.primary[0],
        shuffled.secondary.find(e => e.includes('Lunge') || e.includes('Romanian') || e.includes('Glute')) || shuffled.secondary[0],
        shuffled.accessory.find(e => e.includes('Leg')) || shuffled.accessory[0],
      ];
      break;
      
    case 'Upper Body':
      selectedExercises = [
        shuffled.primary.find(e => e.includes('Bench') || e.includes('Press')) || shuffled.primary[0],
        shuffled.secondary.find(e => e.includes('Press') || e.includes('Row')) || shuffled.secondary[0],
        shuffled.accessory.find(e => e.includes('Lat') || e.includes('Curl') || e.includes('Tricep')) || shuffled.accessory[0],
      ];
      break;
      
    case 'Full Body':
      selectedExercises = [
        shuffled.primary[0],
        shuffled.secondary[0],
        shuffled.accessory[0],
      ];
      break;
  }
  
  // Add 1-2 more accessory exercises
  selectedExercises.push(...shuffled.accessory.slice(1, 3).filter(e => !selectedExercises.includes(e)));
  
  return selectedExercises;
}
