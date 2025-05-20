
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dumbbell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";

const ProgramPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [program, setProgram] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

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
        setProgram(data[0]);
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
      
      const result = await response.json();
      
      // Refresh the program data
      await fetchUserProgram();
      toast.success("Your personalized 4-week program has been created!");
    } catch (error: any) {
      console.error("Error generating program:", error);
      toast.error(error.message || "Failed to generate your program");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <div className="animate-pulse h-6 w-24 bg-muted rounded mb-4"></div>
          <div className="animate-pulse h-32 w-full max-w-md bg-muted rounded"></div>
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
            {isGenerating ? "Generating..." : "Generate My Program"}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Your 4-Week Program</h2>
        <div className="bg-card border border-border rounded-lg p-4">
          <pre className="text-sm overflow-auto max-h-[60vh]">
            {JSON.stringify(program.plan_json, null, 2)}
          </pre>
        </div>
        <Button 
          variant="outline" 
          onClick={generateProgram} 
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate New Program"}
        </Button>
      </div>
    );
  };

  return (
    <PageContainer title="Training Program">
      {renderContent()}
    </PageContainer>
  );
};

export default ProgramPage;
