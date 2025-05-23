
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Dumbbell, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      path: "/", 
      label: "Home", 
      icon: Home 
    },
    { 
      path: "/calendar", 
      label: "Cycle", 
      icon: Calendar 
    },
    { 
      path: "/workout", 
      label: "Workout", 
      icon: Dumbbell 
    },
    { 
      path: "/program", 
      label: "Program", 
      icon: Activity 
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/30 z-10 shadow-[0_-1px_10px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={cn(
              "flex flex-col items-center justify-center py-3 px-5",
              location.pathname === item.path ? "text-primary font-medium" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 mb-1 transition-all",
              location.pathname === item.path ? "text-primary" : "text-muted-foreground"
            )} />
            <span className="text-xs font-display">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
