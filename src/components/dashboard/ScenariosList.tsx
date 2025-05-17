
import { motion } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ScenarioItemProps {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  completion: number;
  status: "completed" | "in-progress" | "locked";
}

const ScenariosList = () => {
  const scenarios: ScenarioItemProps[] = [
    {
      title: "Flight Cancellation",
      description: "Handle a customer requesting a flight cancellation due to emergency",
      difficulty: "Beginner",
      completion: 100,
      status: "completed"
    },
    {
      title: "Booking Modification",
      description: "Help customer change travel dates and accommodate special requests",
      difficulty: "Intermediate",
      completion: 75,
      status: "in-progress"
    },
    {
      title: "Lost Luggage Complaint",
      description: "Address customer concerns about lost luggage and file a claim",
      difficulty: "Advanced",
      completion: 0,
      status: "locked"
    }
  ];

  return (
    <div className="space-y-4">
      {scenarios.map((scenario, index) => (
        <ScenarioItem key={index} index={index} {...scenario} />
      ))}
    </div>
  );
};

const ScenarioItem = ({ title, description, difficulty, completion, status, index }: ScenarioItemProps & { index: number }) => {
  return (
    <motion.div 
      key={index} 
      className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <div className="mb-4 md:mb-0">
        <div className="flex items-center mb-1">
          <h3 className="font-medium text-lg">{title}</h3>
          <Badge className={`ml-2 ${
            difficulty === "Beginner" ? "bg-green-500" : 
            difficulty === "Intermediate" ? "bg-brand-blue" : 
            "bg-purple-600"
          }`}>
            {difficulty}
          </Badge>
        </div>
        <p className="text-gray-500 text-sm">{description}</p>
        {completion > 0 && completion < 100 && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs text-gray-500">{completion}%</span>
            </div>
            <Progress value={completion} className="h-1.5" />
          </div>
        )}
      </div>
      <Button 
        className={`
          ${status === "completed" ? "bg-green-500 hover:bg-green-600" : 
            status === "in-progress" ? "bg-brand-blue hover:bg-brand-blue-dark" : 
            "bg-gray-300 hover:bg-gray-300 cursor-not-allowed"}
        `}
        disabled={status === "locked"}
      >
        {status === "completed" ? "Review" : 
          status === "in-progress" ? "Continue" : 
          "Locked"}
      </Button>
    </motion.div>
  );
};

export default ScenariosList;
