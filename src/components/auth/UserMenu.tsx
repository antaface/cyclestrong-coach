
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserMenu = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </Link>
    );
  }

  // Use the same avatar URL as in profile page
  const userAvatar = user?.user_metadata?.avatar_url || "https://randomuser.me/api/portraits/women/44.jpg";

  return (
    <Link to="/profile">
      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userAvatar} />
          <AvatarFallback>
            {user.user_metadata?.name?.[0]?.toUpperCase() || 
             user.email?.[0]?.toUpperCase() || 
             <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      </Button>
    </Link>
  );
};

export default UserMenu;
