
import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useProfileData } from "@/hooks/use-profile-data";

import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalInfoSection from "@/components/profile/PersonalInfoSection";
import ProgressSection from "@/components/profile/ProgressSection";
import OneRMSection from "@/components/profile/OneRMSection";
import SettingsSection from "@/components/profile/SettingsSection";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { userProfile, loading } = useProfileData();
  const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(true);
  const [isCycleRemindersEnabled, setIsCycleRemindersEnabled] = useState(true);

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
          <ProfileHeader
            userName={userName}
            userEmail={user?.email || ''}
            userAvatar={userAvatar}
            onSignOut={signOut}
          />
          
          <PersonalInfoSection personalInfo={personalInfo} />
          
          <ProgressSection />
          
          <OneRMSection oneRM={oneRM} />
          
          <SettingsSection
            isPushNotificationsEnabled={isPushNotificationsEnabled}
            isCycleRemindersEnabled={isCycleRemindersEnabled}
            onPushNotificationsChange={setIsPushNotificationsEnabled}
            onCycleRemindersChange={setIsCycleRemindersEnabled}
          />
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default ProfilePage;
