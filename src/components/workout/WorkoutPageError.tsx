
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageContainer from "../layout/PageContainer";
import Navbar from "../layout/Navbar";

const WorkoutPageError = () => {
  const handleRetry = () => {
    window.location.reload();
  };
  
  return (
    <>
      <PageContainer title="Error">
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="font-display text-xl mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            We encountered an error loading the workout data.
          </p>
          <Button onClick={handleRetry}>Retry</Button>
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default WorkoutPageError;
