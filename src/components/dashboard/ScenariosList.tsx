
import { motion } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Scenario } from "@/services/dashboardService";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ScenariosListProps {
  completedScenarios: Scenario[];
  inProgressScenarios: Scenario[];
}

const ScenariosList = ({ completedScenarios, inProgressScenarios }: ScenariosListProps) => {
  // Combine completed and in-progress scenarios
  const scenarios = [
    ...completedScenarios.map(s => ({ ...s, status: "completed" as const })),
    ...inProgressScenarios.map(s => ({ ...s, status: "in-progress" as const }))
  ];

  // Add a locked scenario for demo
  const allScenarios = [
    ...scenarios,
    {
      id: "lost-luggage",
      title: "Lost Luggage Complaint",
      description: "Address customer concerns about lost luggage and file a claim",
      difficulty: "Advanced" as const,
      category: "Complaints",
      status: "locked" as const,
      requiredPrerequisites: ["Flight Cancellation", "Booking Modification"]
    }
  ];

  return (
    <div className="space-y-4">
      {allScenarios.map((scenario, index) => (
        <ScenarioItem key={scenario.id} index={index} {...scenario} />
      ))}
    </div>
  );
};

interface ScenarioItemProps extends Scenario {
  index: number;
  status: "completed" | "in-progress" | "locked";
  requiredPrerequisites?: string[];
}

const ScenarioItem = ({ 
  title, description, difficulty, completion = 0, status, index, id, requiredPrerequisites = []
}: ScenarioItemProps) => {
  const navigate = useNavigate();
  const [showPrerequisiteModal, setShowPrerequisiteModal] = useState(false);
  
  const handleScenarioClick = () => {
    if (status === "locked") {
      setShowPrerequisiteModal(true);
      return;
    }
    
    // For completed scenarios, navigate to review
    if (status === "completed") {
      navigate(`/scenarios/${id}?mode=review`);
      return;
    }
    
    // For in-progress scenarios, continue where they left off
    if (status === "in-progress") {
      toast.info(`Loading ${title}...`, {
        description: "Preparing your scenario"
      });
      navigate(`/scenarios/${id}`);
      return;
    }
  };
  
  const handleViewLearningPath = () => {
    setShowPrerequisiteModal(false);
    navigate('/dashboard?tab=learning-path');
    toast.info("View your learning path to unlock this scenario", {
      action: {
        label: "View Prerequisites",
        onClick: () => {
          console.log("Navigate to learning path");
        }
      }
    });
  };
  
  return (
    <>
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
          {status === "in-progress" && (
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
              "bg-gray-300 hover:bg-gray-400"}
          `}
          disabled={false} // Always enable button to handle click behavior in function
          onClick={handleScenarioClick}
        >
          {status === "completed" ? "Review" : 
            status === "in-progress" ? "Continue" : 
            "Locked"}
        </Button>
      </motion.div>
      
      {/* Prerequisites Modal */}
      <AlertDialog open={showPrerequisiteModal} onOpenChange={setShowPrerequisiteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Prerequisites First</AlertDialogTitle>
            <AlertDialogDescription>
              You need to complete the following scenarios before accessing "{title}":
              <ul className="list-disc pl-5 mt-2">
                {requiredPrerequisites.map((prereq, i) => (
                  <li key={i} className="text-sm">{prereq}</li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleViewLearningPath}>View Learning Path</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ScenariosList;
