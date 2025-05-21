
import { Loader2 } from "lucide-react";
import PageContainer from "../layout/PageContainer";
import Navbar from "../layout/Navbar";

const WorkoutPageLoading = () => {
  return (
    <>
      <PageContainer title="Workouts">
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="relative">
            <div className="absolute inset-0 bg-joyful-peach/30 rounded-full blur-md animate-pulse"></div>
            <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
          </div>
          <p className="text-muted-foreground mt-6 font-display text-lg animate-pulse">
            Loading your phase-optimized workouts...
          </p>
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default WorkoutPageLoading;
