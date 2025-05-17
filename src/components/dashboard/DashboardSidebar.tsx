
import UserProgressCard from "@/components/dashboard/UserProgressCard";
import RecommendationsList from "@/components/dashboard/RecommendationsList";
import PerformanceStats from "@/components/dashboard/PerformanceStats";
import { AgentProgressData, AgentPerformance, Recommendation } from "@/services/dashboardService";
import { useEffect } from "react";

interface DashboardSidebarProps {
  progressData: AgentProgressData;
  recommendations: any[];
  performance: AgentPerformance;
}

const DashboardSidebar = ({ progressData, recommendations, performance }: DashboardSidebarProps) => {
  // Log for debugging
  useEffect(() => {
    console.log("Sidebar progressData:", progressData);
  }, [progressData]);

  // Ensure we have valid data to display
  const xpValue = progressData?.currentXp ?? progressData?.xp_points ?? 0;

  return (
    <>
      {/* User Progress Card */}
      <UserProgressCard 
        label="XP Progress" 
        value={xpValue}
        icon="✨"
      />
      
      {/* Recommendations */}
      <RecommendationsList recommendations={recommendations.map(r => ({
        id: r.id || `rec-${Math.random()}`,
        title: r.title || "Recommended Training",
        description: r.description || "Improve your skills with this training",
        type: (r.type || "practice") as "video" | "article" | "practice",
        duration: r.difficulty === "Beginner" ? "5 min" : 
                r.difficulty === "Intermediate" ? "10 min" : "15 min"
      }))} />
      
      {/* Performance Stats */}
      <PerformanceStats performance={performance || {
        response_accuracy: 0,
        issue_resolution_rate: 0,
        customer_satisfaction: 0,
        improvement_areas: [],
        period_start: new Date().toISOString(),
        period_end: new Date().toISOString()
      }} />
    </>
  );
};

export default DashboardSidebar;
