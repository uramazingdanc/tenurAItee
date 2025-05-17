
import { motion } from "@/components/ui/motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import MotionProgressRing from "@/components/MotionProgressRing";

const UserProgressCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Progress</span>
            <MotionProgressRing progress={65} size={38} strokeWidth={4} />
          </CardTitle>
          <CardDescription>Level 3: Advanced Agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-sm font-medium mb-1">2,500 / 5,000 XP</div>
            <Progress value={50} className="h-2" />
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">Current streak: <span className="font-bold text-brand-blue">5 days</span></div>
            <div className="text-xs text-gray-500">Next reward: <span className="font-bold text-amber-500">500 XP</span></div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProgressCard;
