
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
}

const AppHeader = ({ title, showBackButton = false, rightContent }: AppHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <button 
              onClick={() => navigate(-1)} 
              className="p-1.5 mr-3 rounded-full hover:bg-accent/10 text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-display text-foreground">{title}</h1>
        </div>
        {rightContent}
      </div>
    </header>
  );
};

export default AppHeader;
