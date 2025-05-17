
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { textToSpeech, voices } from "@/services/elevenLabsService";
import { SCENARIOS, generateNextCustomerResponse, CallScenario, CallStep, saveCallProgress, generateCallFeedback } from "@/services/callScenarioService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Play, Pause, Square, Phone, CheckCircle, Volume2, XCircle, MessageSquare } from "lucide-react";

const CallSimulation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [transcript, setTranscript] = useState<CallStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<CallScenario | null>(null);
  const [callStatus, setCallStatus] = useState<'selecting' | 'in-progress' | 'completed'>('selecting');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { user } = useAuth();

  // Start a scenario
  const startScenario = (scenario: CallScenario) => {
    setSelectedScenario(scenario);
    setTranscript([scenario.steps[0]]);
    setCurrentStep(1);
    setCallStatus('in-progress');
    
    // Generate audio for the first customer message
    generateAudioForMessage(scenario.steps[0].message);
  };

  // Handle agent response
  const handleOptionClick = async (response: string) => {
    if (!selectedScenario) return;

    // Add agent response to transcript
    const agentStep: CallStep = {
      id: transcript.length + 1,
      speaker: "Agent",
      message: response
    };
    
    const updatedTranscript = [...transcript, agentStep];
    setTranscript(updatedTranscript);
    setIsLoading(true);

    try {
      // Generate the next customer response based on the conversation
      const customerResponse = await generateNextCustomerResponse(
        selectedScenario.id,
        currentStep,
        transcript,
        response
      );

      // Final step check
      if (currentStep >= 5) {
        // This is the final step, end the conversation
        const systemStep: CallStep = {
          id: updatedTranscript.length + 1,
          speaker: "System",
          message: "Call completed. Generating feedback..."
        };
        
        setTranscript([...updatedTranscript, systemStep]);
        setCallStatus('completed');
        
        // Generate feedback
        const feedback = await generateCallFeedback(selectedScenario.id, [...updatedTranscript]);
        setFeedbackMessage(feedback);
        
        // Save progress if user is logged in
        if (user) {
          await saveCallProgress(user.id, selectedScenario.id, [...updatedTranscript], 85);
        }
        
        setIsLoading(false);
        return;
      }

      // Create the customer step
      const customerStep: CallStep = {
        id: updatedTranscript.length + 1,
        speaker: "Customer",
        message: customerResponse.message,
        emotion: customerResponse.emotion
      };
      
      // Update transcript with customer response
      setTranscript([...updatedTranscript, customerStep]);
      
      // Increment step counter
      setCurrentStep(prevStep => prevStep + 1);
      
      // Generate audio for customer response
      await generateAudioForMessage(customerResponse.message);
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error in conversation flow:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "There was an error processing the response. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle play/pause button
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          toast({
            title: "Playback Error",
            description: "There was an error playing the audio. Please try again.",
            variant: "destructive",
          });
        });
      }
      setIsPlaying(!isPlaying);
    } else if (transcript.length > 0) {
      // If audio doesn't exist yet, generate it for the current message
      const lastCustomerMessage = transcript.filter(step => step.speaker === "Customer").pop();
      if (lastCustomerMessage) {
        generateAudioForMessage(lastCustomerMessage.message);
      }
    }
  };

  // Generate audio for a message
  const generateAudioForMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setAudioUrl(null);
      
      const audioUrl = await textToSpeech({
        text: message,
        voiceId: voices.rachel, // Using the Sarah voice for customer
      });
      
      setAudioUrl(audioUrl);
      setIsLoading(false);
      
      // Auto-play the audio if needed
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      setIsLoading(false);
      toast({
        title: "Audio Generation Failed",
        description: "Could not generate the customer's voice. Please check your API key.",
        variant: "destructive",
      });
    }
  };

  // Reset simulation
  const resetSimulation = () => {
    setSelectedScenario(null);
    setTranscript([]);
    setCurrentStep(0);
    setCallStatus('selecting');
    setFeedbackMessage(null);
    setAudioUrl(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };

  // Update audio element when audioUrl changes
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);

  // Get the most recent customer message for display
  const getCurrentCustomerMessage = () => {
    const customerMessages = transcript.filter(step => step.speaker === "Customer");
    return customerMessages.length > 0 ? customerMessages[customerMessages.length - 1] : null;
  };
  
  // Generate response options based on scenario and step
  const getResponseOptions = () => {
    if (!selectedScenario) return [];
    
    // Default options based on scenario type
    switch (selectedScenario.id) {
      case "flightCancellation":
        if (currentStep === 1) {
          return [
            "I understand this is urgent. Let me help you cancel that flight. Can I get your booking reference?",
            "I'm sorry to hear that. I can help you with the cancellation. Do you have your booking details?",
            "Sure, I can cancel that for you. Let me explain our cancellation policy first."
          ];
        } else if (currentStep === 2) {
          return [
            "Thank you for providing that information. Let me check our system for your booking.",
            "I've found your booking. There will be a $150 cancellation fee as per our policy.",
            "I see your booking. Since this is an emergency, I can process this right away."
          ];
        } else if (currentStep >= 3) {
          return [
            "The cancellation has been processed. You'll receive a refund within 7-10 business days.",
            "I've completed the cancellation and sent a confirmation email. Is there anything else you need?",
            "Your flight has been cancelled. The refund minus the cancellation fee will be processed shortly."
          ];
        }
        break;
        
      case "bookingModification":
        if (currentStep === 1) {
          return [
            "I'd be happy to help you modify your booking. Can you please provide your booking reference?",
            "Sure, I can help with that. What dates would you like to change to?",
            "Let me check what options we have available for your booking modification."
          ];
        } else if (currentStep === 2) {
          return [
            "I see your booking. The change fee will be $50 plus any fare difference.",
            "Those dates are available. Would you like me to proceed with the change?",
            "I can add the meal preference to your booking. Is there anything else you'd like to modify?"
          ];
        } else if (currentStep >= 3) {
          return [
            "Your booking has been updated. You'll receive a confirmation email shortly.",
            "The changes have been made successfully. Your new total is $320.",
            "I've updated everything as requested. Is there anything else you need assistance with?"
          ];
        }
        break;
        
      case "refundRequest":
        if (currentStep === 1) {
          return [
            "I can help you with that refund request. May I have your booking reference?",
            "I'd be happy to process your refund. Can you confirm when the cancellation was made?",
            "Let me check our refund policy for your booking type. Do you have your cancellation confirmation?"
          ];
        } else if (currentStep === 2) {
          return [
            "Thank you for that information. Your refund will be processed within 14 business days.",
            "I've found your booking. The refund will be sent to your original payment method.",
            "According to our policy, you're eligible for a full refund. I'll process that right away."
          ];
        } else if (currentStep >= 3) {
          return [
            "The refund has been processed. You'll receive a confirmation email shortly.",
            "I've completed your refund request. Is there anything else you need assistance with?",
            "Your refund has been approved and will be processed within 7-10 business days."
          ];
        }
        break;
    }
    
    // Generic fallback options
    return [
      "I understand your concern. Let me help you with that.",
      "Thank you for that information. I'll process your request right away.",
      "Is there anything else I can help you with today?"
    ];
  };

  return (
    <section className="py-16 bg-white" id="simulation">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-gradient">
            Try a Mock Call Simulation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience our interactive call simulations powered by ElevenLabs voice technology and GPT-4o mini. Practice handling real customer scenarios.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {callStatus === 'selecting' && (
            <div className="grid gap-4 md:grid-cols-3">
              {SCENARIOS.map((scenario) => (
                <Card 
                  key={scenario.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => startScenario(scenario)}
                >
                  <CardHeader className="bg-gradient-to-r from-brand-blue/10 to-brand-green/10 border-b">
                    <CardTitle>{scenario.title}</CardTitle>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <Badge className={
                        scenario.difficulty === "Beginner" 
                          ? "bg-green-500" 
                          : scenario.difficulty === "Intermediate" 
                            ? "bg-brand-blue" 
                            : "bg-purple-600"
                      }>
                        {scenario.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-500">{scenario.duration} min</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {callStatus !== 'selecting' && selectedScenario && (
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-brand-blue/10 to-brand-green/10 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedScenario.title}</CardTitle>
                    <CardDescription>{selectedScenario.description}</CardDescription>
                  </div>
                  <Badge className={
                    selectedScenario.difficulty === "Beginner" 
                      ? "bg-green-500" 
                      : selectedScenario.difficulty === "Intermediate" 
                        ? "bg-brand-blue" 
                        : "bg-purple-600"
                  }>
                    {selectedScenario.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {callStatus === 'in-progress' && (
                  <>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-xl relative">
                        {isPlaying && (
                          <div className="absolute -right-1 -top-1 w-4 h-4 bg-red-500 rounded-full pulse-light"></div>
                        )}
                        C
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">Customer</div>
                        <div className="text-gray-500 text-sm">
                          {getCurrentCustomerMessage()?.emotion === 'concerned' && 'Concerned'}
                          {getCurrentCustomerMessage()?.emotion === 'neutral' && 'Neutral'}
                          {getCurrentCustomerMessage()?.emotion === 'upset' && 'Upset'}
                          {getCurrentCustomerMessage()?.emotion === 'pleased' && 'Pleased'}
                          {!getCurrentCustomerMessage()?.emotion && 'Customer'}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`flex items-center ${isPlaying ? 'border-red-500 text-red-500' : ''}`}
                          onClick={handlePlayPause}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Loading...
                            </>
                          ) : isPlaying ? (
                            <>
                              <Pause className="h-4 w-4 mr-1" />
                              Pause Audio
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" />
                              Play Audio
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg mb-6">
                      <p className="text-gray-700">
                        {getCurrentCustomerMessage()?.message || "Loading..."}
                      </p>
                    </div>
                    
                    {/* Hidden audio element */}
                    <audio ref={audioRef} style={{ display: 'none' }} />

                    <Separator className="my-6" />

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-3">Choose your response:</h4>
                      <div className="space-y-3">
                        {getResponseOptions().map((option, index) => (
                          <div 
                            key={index}
                            className="p-3 border rounded-lg hover:bg-brand-blue/5 hover:border-brand-blue cursor-pointer transition-colors"
                            onClick={() => !isLoading && handleOptionClick(option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {callStatus === 'completed' && (
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
                      <Button onClick={resetSimulation} className="w-full">
                        Try Another Scenario
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>

              {callStatus === 'in-progress' && (
                <CardFooter className="bg-gray-50 flex justify-between">
                  <div className="text-sm text-gray-500">
                    Step {currentStep} of 6
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetSimulation}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    End Call
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallSimulation;
