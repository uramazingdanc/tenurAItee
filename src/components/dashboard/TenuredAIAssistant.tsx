
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { sendChatMessage, ChatMessage } from "@/services/aiChatService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

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
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  
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
    // Open the chat interface instead of navigating
    setChatOpen(true);
    setShowingRecommendation(false);
    
    // Add initial assistant message
    const initialMessage: ChatMessage = {
      id: Date.now().toString() + "-ai",
      role: "assistant",
      content: "I'm your Tenured AI Assistant. I can help you practice scenarios, answer questions about policies, or provide personalized coaching. What would you like to focus on today?",
      timestamp: new Date()
    };
    
    setMessages([initialMessage]);
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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString() + "-user",
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      // Create a contextual prompt based on the conversation and user data
      const contextualPrompt = inputValue;
      
      // Send to AI service
      const response = await sendChatMessage(
        contextualPrompt, 
        messages, 
        undefined
      );
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + "-ai",
        role: "assistant",
        content: response.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Check if the response contains insights/suggestions
      if (response.insights) {
        toast({
          title: "AI Coach Insight",
          description: response.insights,
        });
      }
    } catch (error) {
      console.error("Error in AI coach conversation:", error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: "I'm having trouble connecting. Please try again in a moment.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the chat interface
  if (chatOpen) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Tenured AI Assistant</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setChatOpen(false)}
              className="h-8 w-8 p-0"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ScrollArea className="h-[250px] pr-4">
              <div className="space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user" 
                          ? "bg-brand-blue text-white rounded-br-none" 
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 bg-gray-100 rounded-lg rounded-tl-none">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-500">Generating response...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about policies or scenarios..."
                className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-brand-blue hover:bg-brand-blue-dark"
              >
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default card view (initial state)
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
