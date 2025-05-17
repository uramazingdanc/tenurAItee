
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "@/components/ui/motion";
import MotionProgressRing from "../MotionProgressRing";

interface AgentProgressPanelProps {
  metrics: {
    empathy: number;
    accuracy: number;
    speed: number;
    knowledge: number;
    communication: number;
  };
  currentLevel: number;
  currentXp: number;
  nextLevelXp: number;
  dailyGoalCompleted: number;
  dailyGoalTarget: number;
}

const AgentProgressPanel = ({
  metrics,
  currentLevel,
  currentXp,
  nextLevelXp,
  dailyGoalCompleted,
  dailyGoalTarget
}: AgentProgressPanelProps) => {
  // Calculate level progress percentage
  const levelProgress = Math.min(Math.round((currentXp / nextLevelXp) * 100), 100);
  
  // Calculate daily goal progress
  const dailyGoalProgress = Math.min(Math.round((dailyGoalCompleted / dailyGoalTarget) * 100), 100);
  
  return (
    <div className="space-y-6">
      {/* Skill metrics */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Skill Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-between">
              <div className="w-full flex justify-center mb-2">
                <MotionProgressRing 
                  value={Math.round((
                    metrics.empathy + 
                    metrics.accuracy + 
                    metrics.speed + 
                    metrics.knowledge + 
                    metrics.communication
                  ) / 5)} 
                  size={120} 
                  strokeWidth={8}
                />
              </div>
              
              <div className="w-full mt-4 grid grid-cols-2 gap-3">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="capitalize">{key}</span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Level progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Level Progress</span>
              <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded">
                ⭐ Gold Agent
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white text-xl font-bold"
              >
                {currentLevel}
              </motion.div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-sm">
                <span>Progress to level {currentLevel + 1}</span>
                <span className="font-medium">{levelProgress}%</span>
              </div>
              <Progress value={levelProgress} className="h-2" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{currentXp} XP</span>
                <span>{nextLevelXp} XP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Daily goal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Daily Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-sm">
              Complete {dailyGoalTarget} training activities today
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              {Array(dailyGoalTarget).fill(null).map((_, i) => (
                <div 
                  key={i}
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    i < dailyGoalCompleted 
                      ? 'bg-green-100 text-green-600 border border-green-200' 
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {i < dailyGoalCompleted ? '✓' : ''}
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-sm">
                <span>Today's progress</span>
                <span className="font-medium">
                  {dailyGoalCompleted}/{dailyGoalTarget} completed
                </span>
              </div>
              <Progress value={dailyGoalProgress} className="h-2" />
            </div>
            
            <div className="mt-4 text-center">
              <div className="bg-blue-50 text-blue-600 text-sm rounded p-2">
                Reward: <strong>15 XP</strong> when completed
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AgentProgressPanel;
