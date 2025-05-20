
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Dumbbell, User } from "lucide-react";
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
      path: "/profile", 
      label: "Profile", 
      icon: User 
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={cn(
              "flex flex-col items-center justify-center py-2 px-4",
              location.pathname === item.path ? "text-cs-purple font-medium" : "text-cs-neutral-500"
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
