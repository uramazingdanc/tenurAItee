
import UserProgressCard from "@/components/dashboard/UserProgressCard";
import RecommendationsList from "@/components/dashboard/RecommendationsList";
import PerformanceStats from "@/components/dashboard/PerformanceStats";
import { AgentProgressData, AgentPerformance, Recommendation } from "@/services/dashboardService";

interface DashboardSidebarProps {
  progressData: AgentProgressData;
  recommendations: any[];
  performance: AgentPerformance;
}

const DashboardSidebar = ({ progressData, recommendations, performance }: DashboardSidebarProps) => {
  return (
    <>
      {/* User Progress Card */}
      <UserProgressCard 
        label="XP Progress" 
        value={progressData.currentXp || 0}  // Use currentXp instead of xp_points
        icon="✨"
      />
      
      {/* Recommendations */}
      <RecommendationsList recommendations={recommendations.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        type: (r.type || "practice") as "video" | "article" | "practice",
        duration: r.difficulty === "Beginner" ? "5 min" : 
                r.difficulty === "Intermediate" ? "10 min" : "15 min"
      }))} />
      
      {/* Performance Stats */}
      <PerformanceStats performance={performance} />
    </>
  );
};

export default DashboardSidebar;
