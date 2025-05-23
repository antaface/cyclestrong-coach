
import { useState, useEffect } from "react";
import { Settings, User, ChevronRight, Bell, Calendar, Dumbbell, Clock, LogOut, Camera, Activity } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

import { CyclePhase } from "@/types";

interface UserProfile {
  id: string;
  cycle_length: number;
  last_period: string;
  training_age: string;
  goal: string;
  one_rm?: Record<string, number>;
}

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(true);
  const [isCycleRemindersEnabled, setIsCycleRemindersEnabled] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  // Get user name from metadata or email
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userAvatar = user?.user_metadata?.avatar_url || "https://randomuser.me/api/portraits/women/44.jpg";

  // Mock personal info with defaults
  const personalInfo = {
    age: 28,
    height: "5'6\"",
    weight: "145 lbs",
    trainingAge: userProfile?.training_age || "Intermediate",
    goal: userProfile?.goal || "Strength"
  };

  // Default 1RM values if not available
  const oneRM = userProfile?.one_rm || {
    squat: 100,
    bench: 60,
    deadlift: 130,
    hipThrust: 140
  };

  if (loading) {
    return (
      <>
        <PageContainer title="Profile">
          <div className="space-y-8">
            <div className="text-center">Loading profile...</div>
          </div>
        </PageContainer>
        <Navbar />
      </>
    );
  }

  return (
    <>
      <PageContainer title="Profile">
        <div className="space-y-8">
          {/* User profile header with avatar, email, and logout */}
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
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-destructive/50 text-destructive hover:bg-destructive/5 hover:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
          
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="font-display text-lg">Personal Info</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Age</span>
                <span className="font-display">{personalInfo.age}</span>
              </div>
              <Separator />
              
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Height</span>
                <span className="font-display">{personalInfo.height}</span>
              </div>
              <Separator />
              
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Weight</span>
                <span className="font-display">{personalInfo.weight}</span>
              </div>
              <Separator />
              
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Training Age</span>
                <span className="font-display">{personalInfo.trainingAge}</span>
              </div>
              <Separator />
              
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Goal</span>
                <span className="font-display">{personalInfo.goal}</span>
              </div>
            </div>
          </div>
          
          {/* Progress Section */}
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
          
          {/* 1RM stats */}
          <div className="space-y-4">
            <h3 className="font-display text-lg">Your One-Rep Maximums</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Squat</span>
                <span className="font-display">{oneRM.squat} kg</span>
              </div>
              <Separator />
              
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Bench Press</span>
                <span className="font-display">{oneRM.bench} kg</span>
              </div>
              <Separator />
              
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Deadlift</span>
                <span className="font-display">{oneRM.deadlift} kg</span>
              </div>
              <Separator />
              
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Hip Thrust</span>
                <span className="font-display">{oneRM.hipThrust} kg</span>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-4">
                  Update 1RMs
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Your Strength Stats</DialogTitle>
                  <DialogDescription>
                    Enter your latest one-rep maximums to keep your training program up to date
                  </DialogDescription>
                </DialogHeader>
                {/* Form would go here in a real implementation */}
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Settings section */}
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
                  onCheckedChange={setIsPushNotificationsEnabled}
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
                  onCheckedChange={setIsCycleRemindersEnabled}
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
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default ProfilePage;
