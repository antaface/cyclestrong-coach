
import { Link } from "react-router-dom";
import { Activity, ChevronRight } from "lucide-react";

const ProgressSection = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg">Progress</h3>
      
      <div className="space-y-4">
        <Link to="/habit-history" className="flex items-center justify-between py-3 hover:bg-accent/5 transition-colors -mx-2 px-2 rounded">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-primary mr-4" />
            <span>Habit History</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/60" />
        </Link>
      </div>
    </div>
  );
};

export default ProgressSection;
