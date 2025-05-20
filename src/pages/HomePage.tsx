
import { useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";

// Mock data for charts
const oneRmData = [
  { day: 1, squat: 95, bench: 55, deadlift: 120 },
  { day: 5, squat: 95, bench: 55, deadlift: 125 },
  { day: 10, squat: 97.5, bench: 57.5, deadlift: 127.5 },
  { day: 14, squat: 100, bench: 60, deadlift: 130 },
  { day: 18, squat: 97.5, bench: 57.5, deadlift: 130 },
  { day: 22, squat: 95, bench: 55, deadlift: 127.5 },
  { day: 26, squat: 97.5, bench: 57.5, deadlift: 130 },
  { day: 28, squat: 95, bench: 55, deadlift: 127.5 },
];

const weeklyVolumeData = [
  { name: "Week 1", volume: 12000 },
  { name: "Week 2", volume: 14000 },
  { name: "Week 3", volume: 13000 },
  { name: "Week 4", volume: 10000 },
];

const HomePage = () => {
  // Mock progress state for habit rings
  const habits = {
    training: 80,
    protein: 90,
    sleep: 60,
    mindset: 75,
  };

  return (
    <>
      <PageContainer title="Dashboard">
        <div className="space-y-6">
          {/* Welcome section */}
          <div>
            <h2 className="text-xl font-semibold">Welcome, Sarah</h2>
            <p className="text-cs-neutral-600">
              You're in your <span className="font-medium text-cs-purple">Follicular Phase</span> - Day 10 of your cycle
            </p>
            <Card className="mt-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Today's Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-cs-neutral-600">
                  Your body is primed for high-intensity training today. Challenge yourself with heavier weights or more difficult variations.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Habit rings */}
          <div>
            <h3 className="font-medium mb-3">Daily Discipline Tonnage</h3>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(habits).map(([habit, progress]) => (
                <div key={habit} className="flex flex-col items-center">
                  <div className="relative">
                    <div className="habit-ring w-16 h-16 border-cs-neutral-200">
                      <div 
                        className="habit-ring border-cs-purple"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          borderRadius: '50%',
                          borderTopColor: 'transparent',
                          borderRightColor: progress >= 50 ? undefined : 'transparent',
                          borderBottomColor: progress >= 25 ? undefined : 'transparent',
                          borderLeftColor: progress >= 75 ? undefined : 'transparent',
                          transform: `rotate(${45 + (progress * 3.6)}deg)`
                        }}
                      ></div>
                      <div className="habit-ring-pulse w-14 h-14 border-cs-purple/20"></div>
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                      {progress}%
                    </span>
                  </div>
                  <span className="text-xs text-cs-neutral-500 mt-1 capitalize">{habit}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Estimated 1RM chart */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estimated 1RM Progress</CardTitle>
                <CardDescription>Tracked against cycle day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={oneRmData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 15,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="day" 
                        label={{ value: 'Cycle Day', position: 'insideBottomRight', offset: -5 }} 
                      />
                      <YAxis 
                        label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} 
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="squat" 
                        stroke="#9b87f5" 
                        name="Squat"
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="bench" 
                        stroke="#a3a3a3" 
                        name="Bench" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="deadlift" 
                        stroke="#FFDEE2" 
                        name="Deadlift" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Weekly Training Volume */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weekly Training Volume</CardTitle>
                <CardDescription>Total weight (kg) lifted per week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weeklyVolumeData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 15,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="volume" 
                        fill="#9b87f5" 
                        radius={[4, 4, 0, 0]} 
                        name="Volume (kg)" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Program Progress */}
          <div>
            <h3 className="font-medium mb-2">Current Program Progress</h3>
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cs-neutral-600">Cycle-Adaptive Strength</span>
                      <span className="font-medium">Week 3 of 8</span>
                    </div>
                    <Progress value={37.5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cs-neutral-600">Deadlift Goal (140kg)</span>
                      <span className="font-medium">130kg / 140kg</span>
                    </div>
                    <Progress value={93} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default HomePage;
