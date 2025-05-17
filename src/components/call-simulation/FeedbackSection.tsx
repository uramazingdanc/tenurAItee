
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageSquare } from "lucide-react";
import { CallStep } from "@/services/callScenarioService";
import { useAuth } from "@/contexts/AuthContext";
import { saveCallProgress } from "@/services/callScenarioService";
import { useState } from "react";

interface FeedbackSectionProps {
  feedbackMessage: string | null;
  transcript: CallStep[];
  onReset: () => void;
  scenarioId: string;
}

const FeedbackSection = ({ feedbackMessage, transcript, onReset, scenarioId }: FeedbackSectionProps) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  // Save progress to backend when component mounts
  useState(() => {
    const saveProgress = async () => {
      if (user && !isSaved) {
        try {
          await saveCallProgress(user.id, scenarioId, transcript, 85);
          setIsSaved(true);
        } catch (error) {
          console.error("Failed to save progress:", error);
        }
      }
    };
    
    saveProgress();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center flex-col">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold mb-2">Call Completed!</h3>
        <p className="text-gray-600 text-center">
          You've successfully completed this call simulation. Here's your feedback:
        </p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-5 border">
        <h4 className="font-medium mb-3 flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          AI Coach Feedback
        </h4>
        <p className="text-gray-700">{feedbackMessage || "Analyzing your performance..."}</p>
      </div>
      
      <h4 className="font-medium">Call Transcript</h4>
      <div className="space-y-4 max-h-64 overflow-y-auto p-2">
        {transcript
          .filter(step => step.speaker !== 'System')
          .map((step, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg ${
                step.speaker === 'Customer' 
                  ? 'bg-gray-100 border-l-4 border-l-brand-blue' 
                  : 'bg-blue-50 border-l-4 border-l-green-500'
              }`}
            >
              <div className="font-medium text-sm text-gray-500 mb-1">
                {step.speaker}
              </div>
              <p>{step.message}</p>
            </div>
          ))}
      </div>
      
      <div className="pt-4">
        <Button onClick={onReset} className="w-full">
          Try Another Scenario
        </Button>
      </div>
    </div>
  );
};

export default FeedbackSection;
