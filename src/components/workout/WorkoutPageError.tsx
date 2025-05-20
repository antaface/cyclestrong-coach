
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const WorkoutPageError = () => {
  return (
    <PageContainer title="Error">
      <div className="text-center py-12">
        <h2 className="text-xl font-display mb-3">Could not load workout</h2>
        <p className="text-muted-foreground mb-6">Please try again later</p>
        <Button variant="outline" className="flex items-center mx-auto">
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    </PageContainer>
  );
};

export default WorkoutPageError;
