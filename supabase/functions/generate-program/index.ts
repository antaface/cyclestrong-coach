
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';

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
    
    // Generate the program using OpenAI
    const program = await generateProgramWithGPT(profile);
    
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

async function generateProgramWithGPT(profile: any) {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  const { cycle_length, last_period, training_age, goal, one_rm } = profile;
  
  // Format the date as YYYY-MM-DD
  const formattedLastPeriod = new Date(last_period).toISOString().split('T')[0];
  
  const systemPrompt = `You are a certified strength coach trained in menstrual-aware programming and evidence-based periodization. Create a 4-week hypertrophy mesocycle for a female lifter using the following inputs:
- cycle_length: ${cycle_length}
- last_period: ${formattedLastPeriod}
- training_age: ${training_age}
- goal: ${goal}
${one_rm ? `- one_rm data: ${JSON.stringify(one_rm)}` : ''}

Generate training blocks based on menstrual phases:
- Follicular (Day 1–14): increase volume and intensity
- Ovulation (~Day 15): optional 1RM testing
- Luteal (Day 16–28): slightly reduce load, more recovery focus

Each week should include:
- 3–5 training days
- For each day: list exercises, sets x reps, target RIR, and optional coaching notes

Return a JSON object with this structure:
{
  "title": "4-Week Hypertrophy Mesocycle",
  "description": "Custom program based on menstrual cycle phases",
  "weeks": [
    {
      "theme": "Week 1: Foundation",
      "workouts": [
        {
          "day": 1,
          "focus": "Lower Body",
          "notes": "Optional notes",
          "exercises": [
            { "name": "Exercise name", "sets": 3, "reps": "8-10", "intensity": "RPE 7-8", "notes": "Optional notes" }
          ]
        }
      ]
    }
  ]
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using GPT-4o for best quality results
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate a personalized training program based on my profile information.' }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    const responseData = await response.json();
    
    if (responseData.error) {
      console.error("OpenAI API error:", responseData.error);
      throw new Error(`OpenAI API error: ${responseData.error.message}`);
    }
    
    const generatedContent = responseData.choices[0].message.content;
    
    // Try to parse the JSON from the response
    try {
      // Extract JSON if it's wrapped in markdown code blocks
      let jsonContent = generatedContent;
      
      // Check if the content is wrapped in markdown code blocks
      const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
      const match = jsonRegex.exec(generatedContent);
      
      if (match && match[1]) {
        jsonContent = match[1].trim();
      }
      
      // Parse the JSON
      const program = JSON.parse(jsonContent);
      
      // Ensure the program has the required structure
      if (!program.weeks || !Array.isArray(program.weeks)) {
        // If the weeks array is missing or not an array, add it with empty content
        program.weeks = [];
      }
      
      return program;
    } catch (parseError) {
      console.error("Error parsing GPT response as JSON:", parseError);
      console.log("Raw GPT response:", generatedContent);
      
      // Return a fallback structure that matches our expected format
      return { 
        title: "Training Program",
        description: "Note: The program could not be formatted as structured data. Please see the raw output below.",
        weeks: [],
        raw_output: generatedContent
      };
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error(`Failed to generate program: ${error.message}`);
  }
}
