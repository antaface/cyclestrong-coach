
import { Info } from "lucide-react";

export const CalendarEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Info className="h-10 w-10 text-cs-purple" />
      <p className="mt-4 text-cs-neutral-600">No cycle data available. Please complete your profile setup.</p>
    </div>
  );
};
