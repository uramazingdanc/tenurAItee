
import { motion } from "@/components/ui/motion";
import AgentProgressPanel from "./AgentProgressPanel";
import ActionsFeaturesPanel from "./ActionsFeaturesPanel";
import FeedbackPanel from "./FeedbackPanel";

interface DashboardGridProps {
  userMetrics: {
    empathy: number;
    accuracy: number;
    speed: number;
    knowledge: number;
    communication: number;
  };
  dashboardData: any;
}

const DashboardGrid = ({ userMetrics, dashboardData }: DashboardGridProps) => {
  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Left column - Progress panel */}
      <div>
        <AgentProgressPanel 
          metrics={userMetrics}
          currentLevel={dashboardData.progress?.current_level || 1}
          currentXp={dashboardData.progress?.xp_points || 0}
          nextLevelXp={((dashboardData.progress?.current_level || 1) + 1) * 100} 
          dailyGoalCompleted={dashboardData.completedScenarios?.length || 0}
          dailyGoalTarget={5}
        />
      </div>
      
      {/* Center column - Actions and features */}
      <div>
        <ActionsFeaturesPanel 
          recommendedScenario={dashboardData.recommendations?.[0] || null}
        />
      </div>
      
      {/* Right column - Feedback and achievements */}
      <div>
        <FeedbackPanel 
          performance={dashboardData.performance || {}}
          achievements={dashboardData.achievements || []}
        />
      </div>
    </motion.div>
  );
};

export default DashboardGrid;
