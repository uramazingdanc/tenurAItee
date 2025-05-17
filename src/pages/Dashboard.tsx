
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

const Dashboard = () => {
  const [progress, setProgress] = useState(65);
  const [userStats, setUserStats] = useState<UserStats>({
    scenariosCompleted: 12,
    badgesEarned: 8,
    avgRating: 4.8,
  });
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { user } = useAuth();
  
  // Fetch user progress data when the component mounts
  useEffect(() => {
    if (user?.id) {
      fetchUserProgress(user.id)
        .then(progressData => {
          console.log("User progress data:", progressData);
          // In a real implementation, we would update the state with this data
        })
        .catch(error => {
          console.error("Error fetching user progress:", error);
        });
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto p-4 md:p-6">
        <DashboardHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Section */}
            <ProgressSection progress={progress} userStats={userStats} />

            {/* Tabs Section */}
            <Tabs defaultValue="scenarios">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
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
      </div>
      
      {/* AI Chat Widget */}
      <AIChatWidget isOpen={isAIChatOpen} setIsOpen={setIsAIChatOpen} />
    </div>
  );
};

export default Dashboard;
