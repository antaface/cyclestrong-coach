
import { Bell, Calendar, User, Dumbbell, Settings, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface SettingsSectionProps {
  isPushNotificationsEnabled: boolean;
  isCycleRemindersEnabled: boolean;
  onPushNotificationsChange: (enabled: boolean) => void;
  onCycleRemindersChange: (enabled: boolean) => void;
}

const SettingsSection = ({
  isPushNotificationsEnabled,
  isCycleRemindersEnabled,
  onPushNotificationsChange,
  onCycleRemindersChange
}: SettingsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg">Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-primary mr-4" />
            <span>Push Notifications</span>
          </div>
          <Switch
            checked={isPushNotificationsEnabled}
            onCheckedChange={onPushNotificationsChange}
          />
        </div>
        <Separator />
        
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-primary mr-4" />
            <span>Cycle Reminders</span>
          </div>
          <Switch
            checked={isCycleRemindersEnabled}
            onCheckedChange={onCycleRemindersChange}
          />
        </div>
        <Separator />
        
        <button className="w-full flex items-center justify-between py-3 hover:bg-accent/5 transition-colors -mx-2 px-2 rounded">
          <div className="flex items-center">
            <User className="w-5 h-5 text-primary mr-4" />
            <span>Edit Profile</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/60" />
        </button>
        <Separator />
        
        <button className="w-full flex items-center justify-between py-3 hover:bg-accent/5 transition-colors -mx-2 px-2 rounded">
          <div className="flex items-center">
            <Dumbbell className="w-5 h-5 text-primary mr-4" />
            <span>Exercise Library</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/60" />
        </button>
        <Separator />
        
        <button className="w-full flex items-center justify-between py-3 hover:bg-accent/5 transition-colors -mx-2 px-2 rounded">
          <div className="flex items-center">
            <Settings className="w-5 h-5 text-primary mr-4" />
            <span>App Settings</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/60" />
        </button>
      </div>
    </div>
  );
};

export default SettingsSection;
