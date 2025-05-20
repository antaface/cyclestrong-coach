
import { useState } from "react";
import { Settings, User, ChevronRight, Bell, Calendar, Dumbbell, Clock, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

import { CyclePhase } from "@/types";

const ProfilePage = () => {
  const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(true);
  const [isCycleRemindersEnabled, setIsCycleRemindersEnabled] = useState(true);
  
  // Mock user profile data
  const profile = {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    cycle: {
      length: 28,
      lastPeriod: new Date(2025, 4, 5),
      currentDay: 10,
      currentPhase: CyclePhase.FOLLICULAR
    },
    training: {
      age: "intermediate",
      goal: "strength",
      oneRM: {
        squat: 100,
        bench: 60,
        deadlift: 130,
        hipThrust: 140
      }
    }
  };
  
  const getPhaseName = (phase: CyclePhase) => {
    switch (phase) {
      case CyclePhase.FOLLICULAR:
        return "Follicular";
      case CyclePhase.OVULATION:
        return "Ovulation";
      case CyclePhase.LUTEAL:
        return "Luteal";
      case CyclePhase.MENSTRUAL:
        return "Menstrual";
    }
  };

  return (
    <>
      <PageContainer title="Profile">
        <div className="space-y-8">
          {/* User profile header */}
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-xl">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          
          {/* User stats */}
          <Card className="hover-card">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-display text-lg">Current Stats</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Cycle Day</p>
                  <p className="font-display text-base">{profile.cycle.currentDay} of {profile.cycle.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Current Phase</p>
                  <p className="font-display text-base">{getPhaseName(profile.cycle.currentPhase)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Training Age</p>
                  <p className="font-display text-base capitalize">{profile.training.age}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Goal</p>
                  <p className="font-display text-base capitalize">{profile.training.goal}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 1RM stats */}
          <Card className="hover-card">
            <CardContent className="p-6">
              <h3 className="font-display text-lg mb-4">Your One-Rep Maximums</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Squat</span>
                  <span className="font-display">{profile.training.oneRM.squat} kg</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Bench Press</span>
                  <span className="font-display">{profile.training.oneRM.bench} kg</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Deadlift</span>
                  <span className="font-display">{profile.training.oneRM.deadlift} kg</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Hip Thrust</span>
                  <span className="font-display">{profile.training.oneRM.hipThrust} kg</span>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-5">
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
            </CardContent>
          </Card>
          
          {/* Settings section */}
          <div className="space-y-4">
            <h3 className="font-display text-lg px-1">Settings</h3>
            
            <Card className="hover-card">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-primary mr-4" />
                    <span>Push Notifications</span>
                  </div>
                  <Switch
                    checked={isPushNotificationsEnabled}
                    onCheckedChange={setIsPushNotificationsEnabled}
                  />
                </div>
                <Separator className="bg-border/20" />
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-primary mr-4" />
                    <span>Cycle Reminders</span>
                  </div>
                  <Switch
                    checked={isCycleRemindersEnabled}
                    onCheckedChange={setIsCycleRemindersEnabled}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Menu items */}
            <Card className="hover-card">
              <CardContent className="p-0">
                <button className="w-full flex items-center justify-between p-5 hover:bg-accent/5 transition-colors">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-primary mr-4" />
                    <span>Edit Profile</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/60" />
                </button>
                
                <Separator className="bg-border/20" />
                
                <button className="w-full flex items-center justify-between p-5 hover:bg-accent/5 transition-colors">
                  <div className="flex items-center">
                    <Dumbbell className="w-5 h-5 text-primary mr-4" />
                    <span>Exercise Library</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/60" />
                </button>
                
                <Separator className="bg-border/20" />
                
                <button className="w-full flex items-center justify-between p-5 hover:bg-accent/5 transition-colors">
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 text-primary mr-4" />
                    <span>App Settings</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/60" />
                </button>
              </CardContent>
            </Card>
            
            <Button 
              variant="outline" 
              className="w-full mt-2 border-destructive/50 text-destructive hover:bg-destructive/5 hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default ProfilePage;
