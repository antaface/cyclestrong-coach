
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
        <div className="space-y-6">
          {/* User profile header */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cs-purple">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{profile.name}</h2>
              <p className="text-sm text-cs-neutral-500">{profile.email}</p>
            </div>
          </div>
          
          {/* User stats */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-medium">Current Stats</h3>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-cs-neutral-500">Cycle Day</p>
                  <p className="font-medium">{profile.cycle.currentDay} of {profile.cycle.length}</p>
                </div>
                <div>
                  <p className="text-cs-neutral-500">Current Phase</p>
                  <p className="font-medium">{getPhaseName(profile.cycle.currentPhase)}</p>
                </div>
                <div>
                  <p className="text-cs-neutral-500">Training Age</p>
                  <p className="font-medium capitalize">{profile.training.age}</p>
                </div>
                <div>
                  <p className="text-cs-neutral-500">Goal</p>
                  <p className="font-medium capitalize">{profile.training.goal}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 1RM stats */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Your One-Rep Maximums</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-cs-neutral-600">Squat</span>
                  <span className="font-medium">{profile.training.oneRM.squat} kg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-cs-neutral-600">Bench Press</span>
                  <span className="font-medium">{profile.training.oneRM.bench} kg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-cs-neutral-600">Deadlift</span>
                  <span className="font-medium">{profile.training.oneRM.deadlift} kg</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-cs-neutral-600">Hip Thrust</span>
                  <span className="font-medium">{profile.training.oneRM.hipThrust} kg</span>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-3">
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
          <div className="space-y-3">
            <h3 className="font-medium px-1">Settings</h3>
            
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-cs-purple mr-3" />
                    <span>Push Notifications</span>
                  </div>
                  <Switch
                    checked={isPushNotificationsEnabled}
                    onCheckedChange={setIsPushNotificationsEnabled}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-cs-purple mr-3" />
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
            <Card>
              <CardContent className="p-0">
                <button className="w-full flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-cs-purple mr-3" />
                    <span>Edit Profile</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-cs-neutral-400" />
                </button>
                
                <Separator />
                
                <button className="w-full flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <Dumbbell className="w-5 h-5 text-cs-purple mr-3" />
                    <span>Exercise Library</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-cs-neutral-400" />
                </button>
                
                <Separator />
                
                <button className="w-full flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 text-cs-purple mr-3" />
                    <span>App Settings</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-cs-neutral-400" />
                </button>
              </CardContent>
            </Card>
            
            <Button 
              variant="outline" 
              className="w-full mt-2 border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
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
