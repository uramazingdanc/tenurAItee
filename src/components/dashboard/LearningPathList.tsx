
import { motion } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Lock, Circle } from "lucide-react";

const LearningPathList = () => {
  // Learning path stages
  const stages = [
    { 
      id: 1, 
      name: "Basic Customer Service", 
      description: "Learn the fundamentals of customer service",
      status: "completed" 
    },
    { 
      id: 2, 
      name: "Handling Difficult Customers", 
      description: "Techniques for de-escalation and resolution",
      status: "completed" 
    },
    { 
      id: 3, 
      name: "Technical Support Basics", 
      description: "Troubleshooting common issues",
      status: "in-progress" 
    },
    { 
      id: 4, 
      name: "Advanced Technical Support", 
      description: "Solving complex technical challenges",
      status: "locked" 
    },
    { 
      id: 5, 
      name: "Leadership Skills", 
      description: "Mentoring and team support techniques",
      status: "locked" 
    }
  ];

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Card className={`p-4 border-l-4 ${
            stage.status === 'completed' 
              ? 'border-l-green-500' 
              : stage.status === 'in-progress' 
                ? 'border-l-blue-500' 
                : 'border-l-gray-300'
          } ${stage.status === 'locked' ? 'opacity-60' : ''}`}>
            <div className="flex items-center">
              <div className="mr-3">
                {stage.status === 'completed' ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : stage.status === 'in-progress' ? (
                  <Circle className="h-6 w-6 text-blue-500" />
                ) : (
                  <Lock className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <h4 className="font-medium">{stage.name}</h4>
                <p className="text-sm text-gray-500">{stage.description}</p>
              </div>
              {stage.status === 'in-progress' && (
                <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">In Progress</span>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default LearningPathList;
