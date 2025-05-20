
import PageContainer from "@/components/layout/PageContainer";

const WorkoutPageLoading = () => {
  return (
    <PageContainer title="Loading workout...">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cs-purple"></div>
      </div>
    </PageContainer>
  );
};

export default WorkoutPageLoading;
