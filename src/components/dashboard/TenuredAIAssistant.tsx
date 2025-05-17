
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { sendChatMessage, ChatMessage } from "@/services/aiChatService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface TenuredAIAssistantProps {
  recentCallData?: any;
  userProgress?: any;
}

const TenuredAIAssistant = ({ recentCallData, userProgress }: TenuredAIAssistantProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showingRecommendation, setShowingRecommendation] = useState(true);
  
  // Create initial message based on user progress and recent call data
  const createPersonalizedMessage = (): string => {
    if (recentCallData?.score) {
      if (recentCallData.score > 80) {
        return `Great job on your last call! Your ${recentCallData.score}% score is impressive. Ready to practice refund scenarios today?`;
      } else if (recentCallData.score > 60) {
        return `Your last call was good with a ${recentCallData.score}% score. Want to practice refund scenarios to improve further?`;
      } else {
        return `I noticed your last call had some challenges. Would you like to practice refund scenarios to build confidence?`;
      }
    }
    
    // Default message if no recent call data
    return "Hi there! Ready to practice refund scenarios today?";
  };

  const handleStartSimulation = () => {
    navigate('/scenarios');
  };

  const handleLater = () => {
    setShowingRecommendation(false);
    
    // Show a different recommendation after declining
    toast({
      title: "No problem!",
      description: "I'll be here when you're ready to practice.",
    });
  };
  
  const handleGetPersonalizedInsight = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Create a personalized prompt based on user data
      const prompt = `Based on the agent's recent performance (${recentCallData?.score || "N/A"}% score, 
      strengths in ${userProgress?.strengths?.join(", ") || "customer service"}, 
      areas to improve: ${userProgress?.improvement_areas?.join(", ") || "empathy, product knowledge"}), 
      provide a short, specific tip on how they can improve their customer service skills. Be encouraging and specific.`;
      
      const response = await sendChatMessage(prompt, [], undefined);
      
      toast({
        title: "Personalized Insight",
        description: response.message,
      });
    } catch (error) {
      console.error("Error getting personalized insight:", error);
      toast({
        title: "Couldn't generate insight",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
            <MessageSquare className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold">Tenured AI Assistant</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 flex items-start">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </div>
          <div className="ml-3 bg-gray-100 p-3 rounded-lg rounded-tl-none text-sm flex-grow">
            {showingRecommendation ? (
              createPersonalizedMessage()
            ) : (
              "I can help analyze your calls and provide personalized feedback. What would you like to know?"
            )}
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          {showingRecommendation ? (
            <>
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex-1 bg-brand-blue text-white hover:bg-brand-blue-dark"
                onClick={handleStartSimulation}
              >
                Yes, Let's Go
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={handleLater}
              >
                Later
              </Button>
            </>
          ) : (
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              onClick={handleGetPersonalizedInsight}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Get Personalized Insight"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TenuredAIAssistant;
