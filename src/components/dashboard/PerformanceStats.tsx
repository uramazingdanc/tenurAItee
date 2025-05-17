
import { motion } from "@/components/ui/motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AgentPerformance } from "@/services/dashboardService";

interface PerformanceStatsProps {
  performance: AgentPerformance;
}

const PerformanceStats = ({ performance }: PerformanceStatsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Performance Stats</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Customer Satisfaction</span>
              <span className="text-sm font-medium">{performance.customer_satisfaction}%</span>
            </div>
            <Progress value={performance.customer_satisfaction} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Response Accuracy</span>
              <span className="text-sm font-medium">{performance.response_accuracy}%</span>
            </div>
            <Progress value={performance.response_accuracy} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Issue Resolution Rate</span>
              <span className="text-sm font-medium">{performance.issue_resolution_rate}%</span>
            </div>
            <Progress value={performance.issue_resolution_rate} className="h-2" />
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h4 className="font-medium text-sm mb-3">Areas for improvement:</h4>
            <div className="space-y-2">
              {performance.improvement_areas.map((area, index) => (
                <div key={index} className="text-xs flex items-center">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                  <span>{area.title}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PerformanceStats;
