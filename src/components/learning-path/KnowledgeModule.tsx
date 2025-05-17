
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Lock } from "lucide-react";
import { KnowledgeModule as KnowledgeModuleType } from "@/services/learningPathService";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

interface KnowledgeModuleProps {
  module: KnowledgeModuleType;
  onViewContent: (module: KnowledgeModuleType) => void;
  onComplete: (moduleId: string) => Promise<boolean>;
}

const KnowledgeModule = ({
  module,
  onViewContent,
  onComplete
}: KnowledgeModuleProps) => {
  const [isCompleting, setIsCompleting] = useState(false);
  
  const handleClick = () => {
    if (module.status === 'locked') {
      toast.error("Module locked", {
        description: "Complete the previous modules to unlock this one."
      });
      return;
    }
    
    onViewContent(module);
  };
  
  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (module.status !== 'in-progress') return;
    
    setIsCompleting(true);
    const success = await onComplete(module.id);
    setIsCompleting(false);
    
    if (success) {
      toast.success("Module completed", {
        description: "You've unlocked the next module!"
      });
    } else {
      toast.error("Failed to update progress", {
        description: "Please try again."
      });
    }
  };
  
  return (
    <Card
      className={`p-4 border-l-4 cursor-pointer transition-all hover:shadow-md ${
        module.status === 'completed'
          ? 'border-l-green-500'
          : module.status === 'in-progress'
            ? 'border-l-blue-500'
            : 'border-l-gray-300'
      } ${module.status === 'locked' ? 'opacity-60' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3">
            {module.status === 'completed' ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : module.status === 'in-progress' ? (
              <Circle className="h-6 w-6 text-blue-500" />
            ) : (
              <Lock className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div>
            <h4 className="font-medium">{module.name}</h4>
            <p className="text-sm text-gray-500">{module.description}</p>
          </div>
        </div>
        
        {module.status === 'in-progress' && (
          <Button
            size="sm"
            variant="outline"
            className="ml-2"
            disabled={isCompleting}
            onClick={handleComplete}
          >
            {isCompleting ? "Updating..." : "Mark Complete"}
          </Button>
        )}
        
        {module.status === 'completed' && (
          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Completed</div>
        )}
        
        {module.status === 'in-progress' && (
          <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">In Progress</div>
        )}
      </div>
    </Card>
  );
};

export default KnowledgeModule;
