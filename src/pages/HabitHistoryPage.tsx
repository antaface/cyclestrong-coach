
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Apple, Moon, Brain } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import { useHabitHistory } from "@/hooks/use-habit-history";
import { format } from "date-fns";
import type { HabitType } from "@/types/habits";

const habitIcons = {
  training: { icon: Dumbbell, emoji: "💪", label: "Training" },
  protein: { icon: Apple, emoji: "🍎", label: "Protein" },
  sleep: { icon: Moon, emoji: "💤", label: "Sleep" },
  mindset: { icon: Brain, emoji: "🧠", label: "Mindset" }
};

const HabitHistoryPage = () => {
  const { habitHistory, isLoading } = useHabitHistory();

  if (isLoading) {
    return (
      <>
        <PageContainer title="Habit History" showBackButton={true}>
          <div className="space-y-4">
            {Array.from({ length: 14 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="flex gap-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-6 w-6 bg-muted rounded"></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
        <Navbar />
      </>
    );
  }

  return (
    <>
      <PageContainer title="Habit History" showBackButton={true}>
        <div className="space-y-4">
          {habitHistory.map((dayData) => {
            const completedCount = Object.values(dayData.habits).filter(Boolean).length;
            const date = new Date(dayData.date);
            const formattedDate = format(date, "MMM d");
            const isToday = format(new Date(), "yyyy-MM-dd") === dayData.date;
            
            return (
              <Card key={dayData.date} className={isToday ? "ring-2 ring-primary/20" : ""}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium">
                          {isToday ? "Today" : formattedDate}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {completedCount}/4 completed
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {Object.entries(habitIcons).map(([habitKey, habitInfo]) => {
                        const isCompleted = dayData.habits[habitKey as HabitType];
                        const IconComponent = habitInfo.icon;
                        
                        return (
                          <div key={habitKey} className="relative group">
                            {isCompleted ? (
                              <Badge variant="default" className="p-1 h-8 w-8 flex items-center justify-center">
                                <IconComponent size={12} className="text-white" />
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="p-1 h-8 w-8 flex items-center justify-center opacity-30">
                                <IconComponent size={12} className="text-muted-foreground" />
                              </Badge>
                            )}
                            
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                              {habitInfo.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {completedCount === 4 && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-primary font-medium">🎉 Perfect Day!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          
          {habitHistory.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-2">No habit data yet</h3>
                  <p className="text-sm">Start tracking your habits to see your history here.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default HabitHistoryPage;
