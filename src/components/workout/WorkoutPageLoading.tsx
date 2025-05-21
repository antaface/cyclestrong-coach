
import { Loader2 } from "lucide-react";
import PageContainer from "../layout/PageContainer";
import Navbar from "../layout/Navbar";

const WorkoutPageLoading = () => {
  return (
    <>
      <PageContainer title="Workouts">
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading workouts...</p>
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default WorkoutPageLoading;
