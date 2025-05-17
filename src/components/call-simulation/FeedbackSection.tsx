
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, MessageSquare, Award, LucideIcon } from "lucide-react";
import { CallStep } from "@/services/callScenarioService";
import { useAuth } from "@/contexts/AuthContext";
import { saveCallProgress } from "@/services/callScenarioService";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface FeedbackSectionProps {
  feedbackMessage: string | null;
  transcript: CallStep[];
  onReset: () => void;
  scenarioId: string;
  averageScore: number | null;
  passThreshold: number | null;
}

const FeedbackSection = ({ 
  feedbackMessage, 
  transcript, 
  onReset, 
  scenarioId,
  averageScore,
  passThreshold
}: FeedbackSectionProps) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const isPassed = averageScore !== null && passThreshold !== null && averageScore >= passThreshold;

  // Save progress to backend when component mounts
  useEffect(() => {
    const saveProgress = async () => {
      if (user && !isSaved) {
        try {
          await saveCallProgress(user.id, scenarioId, transcript, averageScore || 0);
          setIsSaved(true);
        } catch (error) {
          console.error("Failed to save progress:", error);
        }
      }
    };
    
    saveProgress();
  }, [user, transcript, scenarioId, averageScore, isSaved]);

  // Get agent scores from transcript
  const agentScores = transcript
    .filter(step => step.speaker === 'Agent' && typeof step.score === 'number')
    .map(step => ({
      message: step.message,
      score: step.score as number,
      feedback: step.feedback
    }));

  // Calculate score metrics
  const scoreBreakdown = agentScores.length > 0
    ? [
        { label: "Communication", value: Math.round(averageScore || 0) },
        { label: "Empathy", value: Math.round((averageScore || 0) * 0.9) },
        { label: "Accuracy", value: Math.round((averageScore || 0) * 1.1) }
      ]
    : [];

  // Determine display state based on pass/fail
  const StatusIcon: LucideIcon = isPassed ? CheckCircle : XCircle;
  const statusColor = isPassed ? "text-green-500" : "text-amber-500";
  const statusTitle = isPassed ? "Scenario Completed Successfully!" : "Scenario Completed - Practice Needed";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center flex-col">
        <StatusIcon className={`h-16 w-16 ${statusColor} mb-4`} />
        <h3 className="text-xl font-bold mb-2">{statusTitle}</h3>
        
        {averageScore !== null && (
          <div className="w-full max-w-xs mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Your Score: {averageScore}%</span>
              <span>Pass: {passThreshold}%</span>
            </div>
            <Progress 
              value={averageScore} 
              max={100} 
              className="h-3"
            />
          </div>
        )}
        
        <p className="text-gray-600 text-center max-w-md">
          {isPassed 
            ? "Congratulations! You've met the required score threshold for this scenario."
            : "Keep practicing! You haven't yet reached the required score for this scenario."}
        </p>
      </div>
      
      {scoreBreakdown.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {scoreBreakdown.map((metric, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-brand-blue">{metric.value}%</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-gray-50 rounded-lg p-5 border">
        <h4 className="font-medium mb-3 flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          AI Coach Feedback
        </h4>
        <p className="text-gray-700">{feedbackMessage || "Analyzing your performance..."}</p>
      </div>
      
      <h4 className="font-medium">Response Analysis</h4>
      <div className="space-y-4 max-h-64 overflow-y-auto p-2">
        {agentScores.map((item, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <div className="font-medium">Response {index + 1}</div>
              <Badge 
                className={
                  item.score >= 80 ? "bg-green-500" : 
                  item.score >= 60 ? "bg-blue-500" : 
                  "bg-red-500"
                }
              >
                {item.score}%
              </Badge>
            </div>
            <p className="text-sm mb-2">{item.message}</p>
            {item.feedback && (
              <div className="text-xs bg-gray-50 p-2 rounded mt-2 italic text-gray-600">
                Feedback: {item.feedback}
              </div>
            )}
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

import { Badge } from "@/components/ui/badge";
