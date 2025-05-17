
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { KnowledgeModule, trackModuleView } from '@/services/learningPathService';
import { useAuth } from '@/contexts/AuthContext';
import ReactMarkdown from 'react-markdown';

interface KnowledgeModulePopupProps {
  module: KnowledgeModule | null;
  isOpen: boolean;
  onClose: () => void;
  onActionClick: (actionType: string) => void;
}

const KnowledgeModulePopup = ({
  module,
  isOpen,
  onClose,
  onActionClick
}: KnowledgeModulePopupProps) => {
  const { user } = useAuth();
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // Track when the user opens the module
  useEffect(() => {
    if (isOpen && module && user) {
      setStartTime(new Date());
      trackModuleView(user.id, module.id);
    }
  }, [isOpen, module, user]);
  
  // Track time spent when the user closes the module
  const handleClose = () => {
    if (startTime && module) {
      const timeSpentMs = new Date().getTime() - startTime.getTime();
      console.log(`Time spent on module ${module.id}: ${timeSpentMs / 1000} seconds`);
      // In a real app, you would send this to your analytics service
    }
    onClose();
  };
  
  if (!module) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{module.name}</DialogTitle>
          <DialogDescription>{module.description}</DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{module.content}</ReactMarkdown>
        </div>
        
        {module.actions && module.actions.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {module.actions.map((action, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => onActionClick(action.type)}
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeModulePopup;
