
import { Loader2 } from "lucide-react";

export const CalendarLoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Loader2 className="h-10 w-10 animate-spin text-cs-purple" />
      <p className="mt-4 text-cs-neutral-600">Loading your cycle data...</p>
    </div>
  );
};
