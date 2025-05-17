
import { motion } from "@/components/ui/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentProgressData } from "@/services/dashboardService";

interface UserProgressCardProps {
  xpProgress: AgentProgressData;
}

const UserProgressCard = ({ xpProgress }: UserProgressCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Your Progress</span>
            <motion.div 
              className="bg-brand-blue text-white rounded-full w-10 h-10 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
            >
              {xpProgress.level}
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm font-medium">Level {xpProgress.level}: Advanced Agent</p>
          
          <div className="mt-2 mb-4">
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(5, (xpProgress.currentXp / xpProgress.requiredXp) * 100))}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{xpProgress.currentXp} / {xpProgress.requiredXp} XP</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-2 rounded border">
              <p className="text-xs text-gray-500">Current streak</p>
              <p className="font-bold flex items-center gap-1">
                <span className="text-amber-500">🔥</span>
                {xpProgress.streak} days
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded border">
              <p className="text-xs text-gray-500">Next reward</p>
              <p className="font-bold text-brand-blue">
                {xpProgress.nextReward}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProgressCard;
