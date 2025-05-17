
import FeatureCardsGrid from "@/components/dashboard/FeatureCardsGrid";
import DashboardTabs from "./DashboardTabs";
import DashboardSidebar from "./DashboardSidebar";
import CallSimulation from "@/components/CallSimulation";

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
      {/* Feature Cards */}
      <FeatureCardsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Section */}
          <DashboardMainContent 
            dashboardData={dashboardData}
            userStats={userStats}
          />
          
          {/* Call Simulation */}
          <CallSimulation />
        </div>
        
        <div className="space-y-6">
          <DashboardSidebar 
            progressData={{
              level: dashboardData.progress.current_level,
              currentXp: dashboardData.progress.xp_points,
              requiredXp: (dashboardData.progress.current_level + 1) * 100,
              streak: dashboardData.progress.current_streak,
              nextReward: "Premium Badge"
            }}
            recommendations={dashboardData.recommendations}
            performance={dashboardData.performance}
          />
        </div>
      </div>
    </>
  );
};

const DashboardMainContent = ({ dashboardData, userStats }) => {
  return (
    <>
      {/* Progress Section */}
      <ProgressSection 
        level={dashboardData.progress.current_level}
        xpProgress={Math.floor((dashboardData.progress.xp_points / ((dashboardData.progress.current_level + 1) * 100)) * 100)}
        scenariosCompleted={userStats.scenariosCompleted}
        badgesEarned={userStats.badgesEarned}
        avgRating={userStats.avgRating}
        skillName="Advanced Problem Solving"
      />

      {/* Tabs Section */}
      <DashboardTabs dashboardData={dashboardData} />
    </>
  );
};

import ProgressSection from "@/components/dashboard/ProgressSection";

export default DashboardContent;
