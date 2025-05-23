
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Apple, Moon, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import { Confetti } from "@/components/ui/confetti";
import BackToTopButton from "@/components/ui/back-to-top-button";
import { useHabits } from "@/hooks/use-habits";
import { useAuth } from "@/context/AuthContext";
import { useProfileData } from "@/hooks/use-profile-data";
import { useProgram } from "@/hooks/use-program";
import { useState } from "react";
import type { HabitType } from "@/types/habits";
import { calculateCycleInfo } from "@/utils/cycle-calculations";

// Mock data for charts
const oneRmData = [{
  day: 1,
  squat: 95,
  bench: 55,
  deadlift: 120
}, {
  day: 5,
  squat: 95,
  bench: 55,
  deadlift: 125
}, {
  day: 10,
  squat: 97.5,
  bench: 57.5,
  deadlift: 127.5
}, {
  day: 14,
  squat: 100,
  bench: 60,
  deadlift: 130
}, {
  day: 18,
  squat: 97.5,
  bench: 57.5,
  deadlift: 130
}, {
  day: 22,
  squat: 95,
  bench: 55,
  deadlift: 127.5
}, {
  day: 26,
  squat: 97.5,
  bench: 57.5,
  deadlift: 130
}, {
  day: 28,
  squat: 95,
  bench: 55,
  deadlift: 127.5
}];

const weeklyVolumeData = [{
  name: "Week 1",
  volume: 12000
}, {
  name: "Week 2",
  volume: 14000
}, {
  name: "Week 3",
  volume: 13000
}, {
  name: "Week 4",
  volume: 10000
}];

const habitIcons = {
  training: Dumbbell,
  protein: Apple,
  sleep: Moon,
  mindset: Brain
};

const HomePage = () => {
  const { user } = useAuth();
  const { userProfile, loading: profileLoading } = useProfileData();
  const { generateProgram, isGenerating } = useProgram();
  const { 
    todaysHabits, 
    isLoading, 
    toggleHabit, 
    getCompletedCount, 
    getProgressPercentage,
    currentStreak 
  } = useHabits();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const completedCount = getCompletedCount();

  // Get user name from metadata or email
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  // Calculate cycle information
  const cycleInfo = userProfile ? calculateCycleInfo(userProfile.last_period, userProfile.cycle_length) : null;

  // Show confetti when all habits are completed
  const handleHabitToggle = async (habitType: HabitType) => {
    await toggleHabit(habitType);
    
    // Check if this completion makes it 4/4
    const newCompletedCount = Object.values({...todaysHabits, [habitType]: !todaysHabits[habitType]}).filter(Boolean).length;
    if (newCompletedCount === 4 && completedCount < 4) {
      setShowConfetti(true);
    }
  };

  const handleStartNewProgram = async () => {
    await generateProgram();
  };

  return <>
      <PageContainer title="Dashboard">
        <div className="space-y-8">
          {/* Welcome section */}
          <div>
            <h2 className="text-2xl font-display mb-1">Welcome, {userName}</h2>
            {cycleInfo ? (
              <p className="text-muted-foreground">
                You're in your <span className="font-medium text-joyful-cream">{cycleInfo.phase}</span> - Day {cycleInfo.day} of your cycle
              </p>
            ) : (
              <p className="text-muted-foreground">Loading cycle information...</p>
            )}
            <Card className="mt-4">
              <CardHeader className="pb-2 p-2">
                <CardTitle className="text-xl">Today's Focus</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <p className="text-muted-foreground">
                  {cycleInfo ? cycleInfo.phaseDescription : 'Loading personalized recommendations...'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Current Program Progress - moved above graphs */}
          <div>
            <h3 className="font-display mb-3 text-xl">Current Program Progress</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Cycle-Adaptive Strength</span>
                  <span className="font-medium">Week 3 of 8</span>
                </div>
                <Progress value={37.5} className="h-3 rounded-full" />
              </div>
              <Button 
                onClick={handleStartNewProgram}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Start New Program'}
              </Button>
            </div>
          </div>
          
          {/* Habit rings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg">Daily Discipline Tonnage</h3>
              <div className="flex items-center gap-2">
                {currentStreak >= 3 && (
                  <Badge variant="accent" className="animate-pulse">
                    🔥 {currentStreak} Day Streak!
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {completedCount}/4 completed
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(todaysHabits).map(([habit, completed]) => {
                const progress = getProgressPercentage(habit as HabitType);
                const IconComponent = habitIcons[habit as HabitType];
                
                return (
                  <div key={habit} className="flex flex-col items-center">
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => handleHabitToggle(habit as HabitType)}
                    >
                      <div className={`habit-ring w-16 h-16 border-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                        completed 
                          ? 'border-primary bg-primary/10 shadow-lg' 
                          : 'border-accent/30 hover:border-accent/50'
                      }`}>
                        <div className="habit-ring-pulse w-14 h-14 border-primary/20"></div>
                        
                        {/* Centered icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconComponent 
                            size={16} 
                            className={`transition-colors duration-200 ${
                              completed ? 'text-white' : 'text-primary'
                            }`}
                          />
                        </div>
                      </div>
                      
                      {/* Hidden checkbox for accessibility */}
                      <Checkbox 
                        checked={completed}
                        disabled={isLoading}
                        className="sr-only"
                        onCheckedChange={() => handleHabitToggle(habit as HabitType)}
                      />
                      
                      {completed && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">✓</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 capitalize">{habit}</span>
                  </div>
                );
              })}
            </div>
            
            {completedCount === 4 && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-medium text-primary">
                  🎉 Perfect day! You've completed all your discipline habits!
                </p>
              </div>
            )}
            
            {/* View Habit History Link */}
            <div className="mt-4 text-center">
              <Link 
                to="/habit-history" 
                className="text-sm text-muted-foreground underline hover:text-primary transition-colors"
              >
                View Habit History
              </Link>
            </div>
          </div>
          
          {/* Combined 1RM and Volume chart */}
          <div>
            <Card>
              <CardHeader className="p-2">
                <CardTitle className="text-xl">Training Progress</CardTitle>
                <CardDescription>Estimated 1RM progress and weekly volume</CardDescription>
              </CardHeader>
              <CardContent className="p-2 space-y-6">
                {/* 1RM Progress */}
                <div>
                  <h4 className="font-medium mb-3">Estimated 1RM Progress</h4>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={oneRmData} margin={{
                      top: 5,
                      right: 5,
                      left: 5,
                      bottom: 15
                    }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" label={{
                        value: 'Cycle Day',
                        position: 'insideBottomRight',
                        offset: -5
                      }} tick={{
                        fill: '#666'
                      }} />
                        <YAxis label={{
                        value: 'Weight (kg)',
                        angle: -90,
                        position: 'insideLeft'
                      }} tick={{
                        fill: '#666'
                      }} />
                        <Tooltip contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }} />
                        <Line type="monotone" dataKey="squat" stroke="#F27261" name="Squat" activeDot={{
                        r: 6
                      }} strokeWidth={2} />
                        <Line type="monotone" dataKey="bench" stroke="#9FB79C" name="Bench" strokeWidth={2} />
                        <Line type="monotone" dataKey="deadlift" stroke="#F9D5B4" name="Deadlift" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Weekly Training Volume */}
                <div>
                  <h4 className="font-medium mb-3">Weekly Training Volume</h4>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyVolumeData} margin={{
                      top: 5,
                      right: 5,
                      left: 5,
                      bottom: 15
                    }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{
                        fill: '#666'
                      }} />
                        <YAxis tick={{
                        fill: '#666'
                      }} />
                        <Tooltip contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }} />
                        <Bar dataKey="volume" fill="#F27261" radius={[4, 4, 0, 0]} name="Volume (kg)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
      
      <Navbar />
      <BackToTopButton />
      
      <Confetti 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
    </>;
};

export default HomePage;
