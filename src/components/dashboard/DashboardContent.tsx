import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ProgressSection from "./ProgressSection";
import UserProgressCard from "./UserProgressCard";
import RecommendationsList from "./RecommendationsList";
import ScenariosList from "./ScenariosList";
import PerformanceStats from "./PerformanceStats";
import AchievementsList from "./AchievementsList";
import LearningPathList from "./LearningPathList";
import TrainingFeaturesGrid from "./TrainingFeaturesGrid";

interface DashboardContentProps {
  dashboardData: any;
  userStats: {
    scenariosCompleted: number;
    badgesEarned: number;
    avgRating: number;
  };
}

const DashboardContent = ({ dashboardData, userStats }: DashboardContentProps) => {
  return (
    <>
      <div className="mb-8">
        {/* User stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <UserProgressCard 
            label="Completed Scenarios"
            value={userStats.scenariosCompleted}
            icon="📋"
          />
          <UserProgressCard 
            label="Badges Earned"
            value={userStats.badgesEarned}
            icon="🏆"
          />
          <UserProgressCard 
            label="Average Rating"
            value={userStats.avgRating}
            icon="⭐"
            suffix="/5"
          />
        </div>

        {/* Training Features */}
        <TrainingFeaturesGrid />
      </div>

      <Tabs defaultValue="progress" className="mb-8">
        <div className="border-b mb-4">
          <div className="flex overflow-x-auto space-x-8">
            <div className="border-b-2 border-brand-blue px-1">
              <button 
                className="px-2 py-2 text-sm font-medium text-brand-blue"
                id="progress-tab"
              >
                Your Progress
              </button>
            </div>
            <div className="border-b-2 border-transparent px-1">
              <button 
                className="px-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                id="scenarios-tab"
              >
                Recommended Scenarios
              </button>
            </div>
            <div className="border-b-2 border-transparent px-1">
              <button 
                className="px-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                id="performance-tab"
              >
                Performance Stats
              </button>
            </div>
            <div className="border-b-2 border-transparent px-1">
              <button 
                className="px-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                id="achievements-tab"
              >
                Achievements
              </button>
            </div>
            <div className="border-b-2 border-transparent px-1">
              <button 
                className="px-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                id="learning-path-tab"
              >
                Learning Path
              </button>
            </div>
          </div>
        </div>
        
        <TabsContent value="progress">
          <ProgressSection 
            xpProgress={dashboardData.progress} 
          />
        </TabsContent>
        
        <TabsContent value="scenarios">
          <ScenariosList 
            completedScenarios={dashboardData.completedScenarios || []}
            inProgressScenarios={[]}
          />
          <RecommendationsList 
            recommendations={dashboardData.recommendations || []}
          />
        </TabsContent>
        
        <TabsContent value="performance">
          <PerformanceStats 
            performance={dashboardData.performance || {}}
          />
        </TabsContent>
        
        <TabsContent value="achievements">
          <AchievementsList 
            achievements={dashboardData.achievements || []}
          />
        </TabsContent>
        
        <TabsContent value="learning-path">
          <LearningPathList />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DashboardContent;
