
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dumbbell, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define a type for our program data structure
interface ProgramWeek {
  theme?: string;
  workouts: Array<{
    day: number;
    focus: string;
    notes?: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string | number;
      intensity?: string;
      notes?: string;
    }>;
  }>;
}

interface ProgramData {
  title?: string;
  description?: string;
  weeks: ProgramWeek[];
  raw_output?: string;
}

interface SupabaseProgram {
  id: string;
  user_id: string;
  plan_json: unknown; // Using unknown initially since we need to parse it
  start_date: string;
  created_at: string;
}

interface Program {
  id: string;
  user_id: string;
  plan_json: ProgramData;
  start_date: string;
  created_at: string;
}

const ProgramPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeWeek, setActiveWeek] = useState("week1");

  useEffect(() => {
    if (user) {
      fetchUserProgram();
    }
  }, [user]);

  const fetchUserProgram = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Get the raw Supabase program data
        const supabaseProgram = data[0] as SupabaseProgram;
        
        // Create a properly typed program object
        const typedProgram: Program = {
          id: supabaseProgram.id,
          user_id: supabaseProgram.user_id,
          start_date: supabaseProgram.start_date,
          created_at: supabaseProgram.created_at,
          plan_json: parseProgramData(supabaseProgram.plan_json)
        };
        
        setProgram(typedProgram);
        
        // Set active week to the first week if weeks exist
        if (typedProgram.plan_json.weeks.length > 0) {
          setActiveWeek("week1");
        }
      } else {
        setProgram(null);
      }
    } catch (error: any) {
      console.error("Error fetching program:", error);
      toast.error("Failed to load your program");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to safely parse program data
  const parseProgramData = (planJson: unknown): ProgramData => {
    try {
      // If plan_json is a string, try to parse it as JSON
      let parsedData: any = planJson;
      
      if (typeof planJson === 'string') {
        try {
          parsedData = JSON.parse(planJson);
        } catch (e) {
          console.error("Failed to parse program JSON string:", e);
          return { title: "Program", description: "Could not parse program data", weeks: [] };
        }
      }
      
      // Ensure weeks array exists
      if (!parsedData.weeks || !Array.isArray(parsedData.weeks)) {
        parsedData.weeks = [];
      }
      
      return parsedData as ProgramData;
    } catch (error) {
      console.error("Error parsing program data:", error);
      return { title: "Program", description: "Error parsing program data", weeks: [] };
    }
  };

  const generateProgram = async () => {
    if (!user) {
      toast.error("You need to be logged in");
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Get user profile data first
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Call the GPT edge function to generate program
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Authentication required");
        navigate("/auth");
        return;
      }
      
      const supabaseUrl = "https://sxeglgdcrfpfgtdexeje.supabase.co";
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-program`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          data: {
            userId: user.id,
            profile: profileData,
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate program");
      }
      
      await fetchUserProgram();
      toast.success("Your personalized 4-week program has been created!");
    } catch (error: any) {
      console.error("Error generating program:", error);
      toast.error(error.message || "Failed to generate your program");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderWorkoutCard = (workout: any, index: number) => {
    return (
      <Card key={`workout-${index}`} className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            Day {workout.day}: {workout.focus}
          </CardTitle>
          <CardDescription>
            {workout.notes || "Focus on form and technique"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workout.exercises?.map((exercise: any, i: number) => (
              <div key={`exercise-${i}`} className="border-b border-border last:border-0 pb-2 last:pb-0">
                <div className="font-medium">{exercise.name}</div>
                <div className="text-sm text-muted-foreground">
                  {exercise.sets} sets × {exercise.reps} reps
                  {exercise.intensity && ` @ ${exercise.intensity}`}
                  {exercise.notes && <div className="italic mt-1">{exercise.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderProgramContent = () => {
    if (!program?.plan_json) return null;
    
    const programData = program.plan_json;
    const weeks = programData.weeks || [];
    
    if (!weeks.length) {
      return (
        <div className="text-center p-4 text-muted-foreground">
          Program structure not found
        </div>
      );
    }

    // Create an array of week numbers for the tabs
    const weekTabs = weeks.map((_: any, index: number) => ({
      value: `week${index + 1}`,
      label: `Week ${index + 1}`
    }));

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{programData.title || "Your Training Program"}</h1>
            <p className="text-muted-foreground mt-1">{programData.description || "4-Week Mesocycle"}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={generateProgram} 
            disabled={isGenerating}
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : "Generate New Program"}
          </Button>
        </div>

        <div className="rounded-lg border border-border p-1">
          <Tabs defaultValue={activeWeek} onValueChange={setActiveWeek}>
            <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${weekTabs.length}, 1fr)` }}>
              {weekTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {weeks.map((week: any, index: number) => (
              <TabsContent key={`week-${index + 1}`} value={`week${index + 1}`} className="py-4 px-2">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">{week.theme || `Week ${index + 1}`}</h3>
                </div>
                
                <div className="space-y-4">
                  {week.workouts?.map((workout: any, workoutIndex: number) => 
                    renderWorkoutCard(workout, workoutIndex)
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        {program.start_date && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Program Start Date</CardTitle>
              <CardDescription>
                {new Date(program.start_date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="sm" onClick={() => navigate('/calendar')} className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                View in Calendar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <div className="text-center">Loading your program...</div>
        </div>
      );
    }

    if (!program) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="rounded-full bg-muted p-6 mb-6">
            <Dumbbell className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No Program Found</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            You don't have a training program yet. Generate a personalized 4-week 
            mesocycle based on your profile data.
          </p>
          <Button 
            onClick={generateProgram} 
            disabled={isGenerating}
            className="min-w-[180px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : "Generate My Program"}
          </Button>
        </div>
      );
    }

    return renderProgramContent();
  };

  return (
    <PageContainer title="Training Program">
      {renderContent()}
    </PageContainer>
  );
};

export default ProgramPage;
