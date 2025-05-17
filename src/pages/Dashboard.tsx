
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import AIChatWidget from "@/components/AIChatWidget";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgressSection from "@/components/dashboard/ProgressSection";
import ScenariosList from "@/components/dashboard/ScenariosList";
import AchievementsList from "@/components/dashboard/AchievementsList";
import LearningPathList from "@/components/dashboard/LearningPathList";
import UserProgressCard from "@/components/dashboard/UserProgressCard";
import RecommendationsList from "@/components/dashboard/RecommendationsList";
import PerformanceStats from "@/components/dashboard/PerformanceStats";
import { motion } from "@/components/ui/motion";
import { toast } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData, DashboardData } from "@/services/dashboardService";

const Dashboard = () => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { user } = useAuth();

  // Use React Query for data fetching
  const { data: dashboardData, error: dashboardError, isLoading } = useQuery({
    queryKey: ['dashboardData', user?.id],
    queryFn: fetchDashboardData,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Demo effect to show a welcome toast
  useEffect(() => {
    if (user?.id) {
      const hasSeenWelcome = sessionStorage.getItem('welcomed');
      if (!hasSeenWelcome) {
        setTimeout(() => {
          toast.success("Welcome back to your training dashboard!", {
            description: "You have new recommended scenarios to explore.",
            action: {
              label: "View",
              onClick: () => document.getElementById("scenarios-tab")?.click()
            }
          });
          sessionStorage.setItem('welcomed', 'true');
        }, 1500);
      }
    }
  }, [user?.id]);

  // Display loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (dashboardError || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Dashboard</CardTitle>
            <CardDescription>We encountered a problem loading your dashboard data.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-4">
              {dashboardError instanceof Error ? dashboardError.message : "Unknown error"}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-brand-blue-dark"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock stats data since it's not in the actual data structure
  const userStats = {
    scenariosCompleted: dashboardData.completedScenarios?.length || 0,
    badgesEarned: dashboardData.achievements?.length || 0,
    avgRating: 4.8
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <motion.div 
        className="container mx-auto p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Section */}
            <ProgressSection 
              progress={{
                level: dashboardData.progress.current_level,
                currentXp: dashboardData.progress.xp_points,
                requiredXp: (dashboardData.progress.current_level + 1) * 100,
                streak: dashboardData.progress.current_streak,
                nextReward: "New Badge"
              }}
              userStats={userStats}
            />

            {/* Tabs Section */}
            <Tabs defaultValue="scenarios">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="scenarios" id="scenarios-tab">Scenarios</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="learning">Learning Path</TabsTrigger>
              </TabsList>
              
              <TabsContent value="scenarios">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Scenarios</CardTitle>
                    <CardDescription>Practice with these customer service scenarios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScenariosList 
                      completedScenarios={dashboardData.completedScenarios.map(s => ({
                        id: s.scenarios.id,
                        title: s.scenarios.title,
                        description: s.scenarios.description,
                        difficulty: s.scenarios.difficulty as "Beginner" | "Intermediate" | "Advanced",
                        category: s.scenarios.category,
                        status: "completed" as const,
                        score: s.score || undefined,
                        feedback: s.feedback
                      }))}
                      inProgressScenarios={[]} // No in-progress scenarios in the data yet
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Achievements</CardTitle>
                    <CardDescription>Badges and rewards you've earned</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AchievementsList achievements={dashboardData.achievements.map(a => ({
                      id: a.achievements.id,
                      name: a.achievements.name,
                      description: a.achievements.description,
                      icon: a.achievements.icon,
                      category: a.achievements.category,
                      unlocked: true,
                      earnedAt: new Date(a.earned_at).toLocaleDateString()
                    }))} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="learning">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Learning Path</CardTitle>
                    <CardDescription>Follow this path to mastery</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LearningPathList />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            {/* User Progress Card */}
            <UserProgressCard 
              xpProgress={{
                level: dashboardData.progress.current_level,
                currentXp: dashboardData.progress.xp_points,
                requiredXp: (dashboardData.progress.current_level + 1) * 100,
                streak: dashboardData.progress.current_streak,
                nextReward: "Premium Badge"
              }}
            />
            
            {/* Recommendations */}
            <RecommendationsList recommendations={dashboardData.recommendations.map(r => ({
              id: r.id,
              title: r.title,
              description: r.description,
              type: (r.type || "practice") as "video" | "article" | "practice",
              duration: r.difficulty === "Beginner" ? "5 min" : 
                      r.difficulty === "Intermediate" ? "10 min" : "15 min"
            }))} />
            
            {/* Performance Stats */}
            <PerformanceStats performance={dashboardData.performance} />
          </div>
        </div>
      </motion.div>
      
      {/* AI Chat Widget */}
      <AIChatWidget isOpen={isAIChatOpen} setIsOpen={setIsAIChatOpen} />
    </div>
  );
};

export default Dashboard;
