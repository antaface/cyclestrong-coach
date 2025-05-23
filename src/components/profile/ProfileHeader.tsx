
import { Camera, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  userName: string;
  userEmail: string;
  userAvatar: string;
  onSignOut: () => void;
}

const ProfileHeader = ({ userName, userEmail, userAvatar, onSignOut }: ProfileHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary">
            <img
              src={userAvatar}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors">
            <Camera size={12} />
          </button>
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl">{userName}</h2>
          <p className="text-sm text-muted-foreground">{userEmail}</p>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full border-destructive/50 text-destructive hover:bg-destructive/5 hover:text-destructive"
        onClick={onSignOut}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>
    </div>
  );
};

export default ProfileHeader;
