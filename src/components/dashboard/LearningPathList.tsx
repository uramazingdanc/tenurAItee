
import { motion } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";

interface LearningPathItemProps {
  title: string;
  description: string;
  status: "completed" | "in-progress" | "locked";
  modules: string[];
}

const LearningPathList = () => {
  const learningPaths: LearningPathItemProps[] = [
    {
      title: "Customer Service Basics",
      description: "Learn foundational skills for successful customer interactions",
      status: "completed",
      modules: ["Active Listening", "Empathy in Service", "Clear Communication"]
    },
    {
      title: "Travel Industry Knowledge",
      description: "Understanding the travel industry context and common issues",
      status: "in-progress",
      modules: ["Booking Policies", "Cancellation Procedures", "Travel Insurance Basics"]
    },
    {
      title: "Advanced Problem Solving",
      description: "Tackle complex customer problems efficiently",
      status: "locked",
      modules: ["Multi-Issue Resolution", "Creative Solutions", "Exception Handling"]
    }
  ];

  return (
    <div className="relative pl-8 pb-8">
      <div className="absolute top-0 bottom-0 left-4 w-px bg-gray-200"></div>
      
      {learningPaths.map((path, index) => (
        <LearningPathItem key={index} index={index} {...path} />
      ))}
    </div>
  );
};

const LearningPathItem = ({ title, description, status, modules, index }: LearningPathItemProps & { index: number }) => {
  return (
    <motion.div 
      key={index} 
      className="mb-8 relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + (index * 0.2), duration: 0.4 }}
    >
      <motion.div 
        className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-2 ${
          status === "completed" ? "bg-green-500 border-green-500" :
          status === "in-progress" ? "bg-white border-brand-blue" :
          "bg-white border-gray-300"
        } flex items-center justify-center z-10`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 + (index * 0.2), duration: 0.3, type: "spring" }}
      >
        {status === "completed" && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </motion.div>
      <div>
        <h3 className={`font-medium text-lg ${status === "locked" ? "text-gray-400" : ""}`}>
          {title}
        </h3>
        <p className={`text-sm ${status === "locked" ? "text-gray-400" : "text-gray-500"} mb-3`}>
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {modules.map((module, i) => (
            <Badge 
              key={i}
              variant="outline" 
              className={status === "locked" ? "text-gray-400 border-gray-300" : ""}
            >
              {module}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LearningPathList;
