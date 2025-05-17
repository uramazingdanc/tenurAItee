
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserProgress } from "@/services/scenarioService";
import AIChatWidget from "@/components/AIChatWidget";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgressSection from "@/components/dashboard/ProgressSection";
import ScenariosList from "@/components/dashboard/ScenariosList";
import AchievementsList from "@/components/dashboard/AchievementsList";
import LearningPathList from "@/components/dashboard/LearningPathList";
import UserProgressCard from "@/components/dashboard/UserProgressCard";
import RecommendationsList from "@/components/dashboard/RecommendationsList";
import PerformanceStats from "@/components/dashboard/PerformanceStats";
import { UserStats } from "@/types/scenario";
import { motion } from "@/components/ui/motion";
import { toast } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { user } = useAuth();

  // Use React Query for data fetching
  const { data: progressData, error: progressError } = useQuery({
    queryKey: ['userProgress', user?.id],
    queryFn: () => user?.id ? fetchUserProgress(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });
  
  // Demo user stats - in a real implementation this would come from progressData
  const [userStats] = useState<UserStats>({
    scenariosCompleted: 12,
    badgesEarned: 8,
    avgRating: 4.8,
  });
  
  // Calculate progress based on user data
  const calculateProgress = () => {
    if (!progressData || progressData.length === 0) return 65; // Default progress
    
    // Calculate based on completed scenarios vs total available
    const completedCount = progressData.filter(p => p.completed).length;
    const totalCount = progressData.length;
    
    return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 65;
  };
  
  const progress = calculateProgress();
  
  useEffect(() => {
    if (progressError) {
      console.error("Error fetching user progress:", progressError);
      toast.error("Failed to load your progress data. Please try again later.");
    }
  }, [progressError]);
  
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
            <ProgressSection progress={progress} userStats={userStats} />

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
                    <ScenariosList />
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
                    <AchievementsList />
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
            <UserProgressCard />
            
            {/* Recommendations */}
            <RecommendationsList />
            
            {/* Performance Stats */}
            <PerformanceStats />
          </div>
        </div>
      </motion.div>
      
      {/* AI Chat Widget */}
      <AIChatWidget isOpen={isAIChatOpen} setIsOpen={setIsAIChatOpen} />
    </div>
  );
};

export default Dashboard;
