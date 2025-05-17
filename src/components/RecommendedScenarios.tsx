
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { FileText, Phone, MessageSquare } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SCENARIOS } from "@/services/callScenarioService";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

const RecommendedScenarios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [showPrerequisiteModal, setShowPrerequisiteModal] = useState<{show: boolean, scenario?: any}>({show: false});
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch recommendations from backend if user is logged in
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data } = await supabase.functions.invoke('dashboard-data');
        
        if (data && data.recommendations && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
        } else {
          // If no recommendations, fall back to default scenarios
          setRecommendations(SCENARIOS.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            category: s.difficulty,
            locked: s.id !== "flightCancellation",
            requiredPrerequisites: s.id === "refundRequest" ? ["Booking Modification"] : []
          })));
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        toast.error("Could not load recommendations", {
          description: "Using default scenarios instead"
        });
        
        // Fall back to default scenarios
        setRecommendations(SCENARIOS.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
          category: s.difficulty,
          locked: s.id !== "flightCancellation",
          requiredPrerequisites: s.id === "refundRequest" ? ["Booking Modification"] : []
        })));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [user]);

  // Map scenario types to their respective icons
  const getScenarioIcon = (id: string) => {
    switch (id) {
      case "flightCancellation":
        return Phone;
      case "bookingModification":
        return FileText;
      case "refundRequest":
        return MessageSquare;
      default:
        return Phone;
    }
  };

  const handleScenarioClick = (scenario: any) => {
    if (scenario.locked) {
      setShowPrerequisiteModal({
        show: true,
        scenario
      });
      return;
    }
    
    // Navigate to scenario
    toast.info(`Loading ${scenario.title}...`, {
      description: "Preparing your simulation"
    });
    navigate(`/scenarios/${scenario.id}`);
  };

  const handleViewLearningPath = () => {
    setShowPrerequisiteModal({show: false});
    navigate('/dashboard?tab=learning-path');
  };

  // Use recommendations from backend, or default to SCENARIOS if not available
  const displayScenarios = recommendations.length > 0 ? 
    recommendations : 
    SCENARIOS.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      category: s.difficulty,
      locked: s.id !== "flightCancellation",
      requiredPrerequisites: s.id === "refundRequest" ? ["Booking Modification"] : []
    }));

  return (
    <div className="py-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Recommended For You</h2>
        <p className="text-sm text-gray-600">Based on your progress</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="h-24 bg-gray-100 animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {displayScenarios.slice(0, 3).map((scenario, index) => {
            const ScenarioIcon = getScenarioIcon(scenario.id);
            
            return (
              <div key={scenario.id} onClick={() => handleScenarioClick(scenario)}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-4 border hover:border-brand-blue hover:shadow-sm transition-all duration-200 cursor-pointer">
                    <div className="flex items-center">
                      <div className={`h-12 w-12 flex items-center justify-center rounded-md ${
                        scenario.category === "Beginner" ? "bg-green-50" : 
                        scenario.category === "Intermediate" ? "bg-brand-blue/10" : "bg-purple-50"
                      } mr-4`}>
                        <ScenarioIcon className={`h-6 w-6 ${
                          scenario.category === "Beginner" ? "text-green-500" : 
                          scenario.category === "Intermediate" ? "text-brand-blue" : "text-purple-500"
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {scenario.title}
                          {scenario.locked && (
                            <span className="ml-2 text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">Locked</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Practice scenario • {SCENARIOS.find(s => s.id === scenario.id)?.duration || 5} min
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Prerequisites Modal */}
      <AlertDialog 
        open={showPrerequisiteModal.show} 
        onOpenChange={(open) => setShowPrerequisiteModal({show: open})}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Prerequisites First</AlertDialogTitle>
            <AlertDialogDescription>
              You need to complete the following scenarios before accessing "{showPrerequisiteModal.scenario?.title}":
              <ul className="list-disc pl-5 mt-2">
                {showPrerequisiteModal.scenario?.requiredPrerequisites.map((prereq: string, i: number) => (
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
    </div>
  );
};

export default RecommendedScenarios;
