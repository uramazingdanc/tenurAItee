
import { useState, useEffect } from "react";
import { motion } from "@/components/ui/motion";
import KnowledgeModule from "./KnowledgeModule";
import KnowledgeModulePopup from "./KnowledgeModulePopup";
import { KnowledgeModule as KnowledgeModuleType, getUserLearningPath, updateModuleStatus } from "@/services/learningPathService";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";

const LearningPath = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<KnowledgeModuleType[]>([]);
  const [selectedModule, setSelectedModule] = useState<KnowledgeModuleType | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPath = async () => {
      setIsLoading(true);
      try {
        const path = await getUserLearningPath(user?.id || '');
        setModules(path);
      } catch (error) {
        console.error("Failed to fetch learning path:", error);
        toast.error("Failed to load learning path", {
          description: "Please refresh the page to try again."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPath();
  }, [user]);

  const handleViewContent = (module: KnowledgeModuleType) => {
    setSelectedModule(module);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedModule(null);
  };

  const handleActionClick = (actionType: string) => {
    // In a real app, these would navigate to different activities
    switch (actionType) {
      case 'video':
        toast.info("Launching videos", { description: "Video training would open here" });
        break;
      case 'simulation':
        toast.info("Launching simulation", { description: "Simulation would start here" });
        break;
      case 'quiz':
        toast.info("Starting quiz", { description: "Quiz would begin here" });
        break;
      default:
        toast.info(`Launching ${actionType}`, { description: `${actionType} activity would start here` });
    }
  };

  const handleCompleteModule = async (moduleId: string): Promise<boolean> => {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please log in to track your progress."
      });
      return false;
    }

    try {
      const success = await updateModuleStatus(user.id, moduleId, 'completed');
      if (success) {
        // Update local state to reflect the changes
        setModules(prevModules => {
          const updatedModules = [...prevModules];
          const completedIndex = updatedModules.findIndex(m => m.id === moduleId);
          
          if (completedIndex >= 0) {
            updatedModules[completedIndex] = {
              ...updatedModules[completedIndex],
              status: 'completed'
            };
            
            // Unlock the next module if it exists
            if (completedIndex < updatedModules.length - 1) {
              updatedModules[completedIndex + 1] = {
                ...updatedModules[completedIndex + 1],
                status: 'in-progress'
              };
            }
          }
          
          return updatedModules;
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error completing module:", error);
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(index => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((module, index) => (
        <motion.div
          key={module.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <KnowledgeModule
            module={module}
            onViewContent={handleViewContent}
            onComplete={handleCompleteModule}
          />
        </motion.div>
      ))}

      {selectedModule && (
        <KnowledgeModulePopup
          module={selectedModule}
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          userId={user?.id || ''}
        />
      )}
    </div>
  );
};

export default LearningPath;
