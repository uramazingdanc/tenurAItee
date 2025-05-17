
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FeedbackPanelProps {
  performance: {
    response_accuracy?: number;
    issue_resolution_rate?: number;
    customer_satisfaction?: number;
  };
  achievements: Array<{
    name: string;
    description: string;
    icon?: string;
    unlocked: boolean;
    date?: string;
  }>;
}

const FeedbackPanel = ({ performance, achievements }: FeedbackPanelProps) => {
  // Default performance metrics if not provided
  const metrics = {
    empathy: performance.customer_satisfaction || 85,
    accuracy: performance.response_accuracy || 90,
    speed: performance.issue_resolution_rate || 88
  };
  
  // Default achievements if none provided
  const defaultAchievements = [
    {
      name: "Fast Resolver",
      description: "Resolved 5 issues in record time",
      icon: "🏅",
      unlocked: true,
      date: "Today"
    },
    {
      name: "Policy Expert",
      description: "Demonstrated exceptional knowledge of company policies",
      icon: "💡",
      unlocked: true,
      date: "2 days ago"
    }
  ];
  
  const displayAchievements = achievements.length > 0 ? achievements : defaultAchievements;
  
  return (
    <div className="space-y-6">
      {/* Performance Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              📊 Your Last Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Empathy</span>
                  <span className="font-medium">{metrics.empathy}%</span>
                </div>
                <Progress value={metrics.empathy} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Accuracy</span>
                  <span className="font-medium">{metrics.accuracy}%</span>
                </div>
                <Progress value={metrics.accuracy} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Speed</span>
                  <span className="font-medium">{metrics.speed}%</span>
                </div>
                <Progress value={metrics.speed} className="h-2" />
              </div>
            </div>
            
            <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-100 text-green-700 text-sm">
              <span className="font-medium">🎯 Feedback: </span>
              Great job de-escalating that situation!
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayAchievements.slice(0, 3).map((achievement, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">
                    {achievement.icon || "🏆"}
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-xs text-gray-500">{achievement.description}</div>
                  </div>
                  <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                    {achievement.date || "Recent"}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-blue-600 text-sm hover:text-blue-700 hover:underline">
                View all achievements
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FeedbackPanel;
