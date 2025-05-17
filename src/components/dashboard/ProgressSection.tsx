
import { motion } from "@/components/ui/motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressSectionProps {
  progress: number;
  userStats: {
    scenariosCompleted: number;
    badgesEarned: number;
    avgRating: number;
  };
}

const ProgressSection = ({ progress, userStats }: ProgressSectionProps) => {
  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your training milestones and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">Level 3: Advanced Problem Solving</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            >
              <Progress value={progress} className="h-2 mb-6" />
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 border-0">
                  <CardContent className="p-4">
                    <div className="text-4xl font-bold text-brand-blue mb-1">{userStats.scenariosCompleted}</div>
                    <div className="text-sm text-gray-600">Scenarios Completed</div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 border-0">
                  <CardContent className="p-4">
                    <div className="text-4xl font-bold text-brand-green mb-1">{userStats.badgesEarned}</div>
                    <div className="text-sm text-gray-600">Badges Earned</div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-0">
                  <CardContent className="p-4">
                    <div className="text-4xl font-bold text-purple-600 mb-1">{userStats.avgRating}</div>
                    <div className="text-sm text-gray-600">Avg. Customer Rating</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProgressSection;
