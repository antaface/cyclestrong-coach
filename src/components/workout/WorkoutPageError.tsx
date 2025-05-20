
import PageContainer from "@/components/layout/PageContainer";

const WorkoutPageError = () => {
  return (
    <PageContainer title="Error">
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-2">Could not load workout</h2>
        <p className="text-cs-neutral-600">Please try again later</p>
      </div>
    </PageContainer>
  );
};

export default WorkoutPageError;
