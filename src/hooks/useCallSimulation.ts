import { useState, useRef, useEffect } from "react";
import { textToSpeech, voices } from "@/services/elevenLabsService";
import { 
  generateNextCustomerResponse, 
  generateCallFeedback, 
  saveCallProgress, 
  CallScenario, 
  CallStep,
  getUnlockedScenarios
} from "@/services/callScenarioService";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface CallSimulationState {
  isPlaying: boolean;
  currentStep: number;
  transcript: CallStep[];
  isLoading: boolean;
  audioUrl: string | null;
  selectedScenario: CallScenario | null;
  callStatus: 'selecting' | 'in-progress' | 'completed';
  feedbackMessage: string | null;
  currentScore: number | null;
  averageScore: number | null;
  passThreshold: number | null;
  unlockedScenarios: string[];
}

export function useCallSimulation() {
  const [state, setState] = useState<CallSimulationState>({
    isPlaying: false,
    currentStep: 0,
    transcript: [],
    isLoading: false,
    audioUrl: null,
    selectedScenario: null,
    callStatus: 'selecting',
    feedbackMessage: null,
    currentScore: null,
    averageScore: null,
    passThreshold: null,
    unlockedScenarios: []
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { user } = useAuth();

  // Fetch unlocked scenarios when user changes
  useEffect(() => {
    const fetchUnlockedScenarios = async () => {
      if (user) {
        const unlocked = await getUnlockedScenarios(user.id);
        setState(prev => ({
          ...prev,
          unlockedScenarios: unlocked
        }));
      } else {
        setState(prev => ({
          ...prev, 
          unlockedScenarios: ["flightCancellation"] // Only first scenario unlocked if not logged in
        }));
      }
    };
    
    fetchUnlockedScenarios();
  }, [user]);
  
  // Start a scenario
  const startScenario = (scenario: CallScenario) => {
    setState(prev => ({
      ...prev,
      selectedScenario: scenario,
      transcript: [scenario.steps[0]],
      currentStep: 1,
      callStatus: 'in-progress',
      passThreshold: scenario.passingScore || 70
    }));
    
    // Generate audio for the first customer message
    generateAudioForMessage(scenario.steps[0].message);
  };

  // Handle agent response
  const handleOptionClick = async (response: string) => {
    if (!state.selectedScenario) return;

    // Add agent response to transcript
    const agentStep: CallStep = {
      id: state.transcript.length + 1,
      speaker: "Agent",
      message: response
    };
    
    const updatedTranscript = [...state.transcript, agentStep];
    
    setState(prev => ({
      ...prev,
      transcript: updatedTranscript,
      isLoading: true,
      currentScore: null // Reset current score while loading
    }));

    try {
      // Generate the next customer response based on the conversation
      const customerResponse = await generateNextCustomerResponse(
        state.selectedScenario.id,
        state.currentStep,
        state.transcript,
        response,
        user?.id // Pass user ID to log interaction
      );

      // Update agent step with score and feedback if available
      if (customerResponse.score !== undefined) {
        agentStep.score = customerResponse.score;
        agentStep.feedback = customerResponse.feedback;
        
        // Calculate running average score
        const scoredResponses = updatedTranscript
          .filter(step => step.speaker === "Agent" && step.score !== undefined)
          .map(step => step.score as number);
        
        const totalScore = scoredResponses.reduce((sum, score) => sum + score, 0);
        const averageScore = scoredResponses.length > 0 
          ? Math.round(totalScore / scoredResponses.length) 
          : 0;
        
        updatedTranscript[updatedTranscript.length - 1] = agentStep;
        
        // Show toast with feedback
        if (customerResponse.feedback) {
          toast({
            title: `Response Score: ${customerResponse.score}%`,
            description: customerResponse.feedback,
            variant: customerResponse.score >= 80 ? "default" : 
                    customerResponse.score >= 60 ? "default" : "destructive",
          });
        }
      }

      // Final step check
      if (state.currentStep >= 5) {
        // This is the final step, end the conversation
        const systemStep: CallStep = {
          id: updatedTranscript.length + 1,
          speaker: "System",
          message: "Call completed. Generating feedback..."
        };
        
        const finalTranscript = [...updatedTranscript, systemStep];
        
        setState(prev => ({
          ...prev,
          transcript: finalTranscript,
          callStatus: 'completed',
          isLoading: false
        }));
        
        // Generate feedback
        const feedback = await generateCallFeedback(state.selectedScenario.id, finalTranscript);
        
        // Calculate final score
        const scoredResponses = finalTranscript
          .filter(step => step.speaker === "Agent" && step.score !== undefined)
          .map(step => step.score as number);
        
        const totalScore = scoredResponses.reduce((sum, score) => sum + score, 0);
        const averageScore = scoredResponses.length > 0 
          ? Math.round(totalScore / scoredResponses.length) 
          : 0;
        
        const passed = averageScore >= (state.selectedScenario.passingScore || 70);
        
        setState(prev => ({
          ...prev,
          feedbackMessage: feedback,
          averageScore: averageScore
        }));
        
        // Save progress if user is logged in
        if (user) {
          const saveResult = await saveCallProgress(user.id, state.selectedScenario.id, finalTranscript, averageScore);
          
          if (saveResult.success && saveResult.passed) {
            // Refresh unlocked scenarios if passed
            const unlocked = await getUnlockedScenarios(user.id);
            setState(prev => ({
              ...prev,
              unlockedScenarios: unlocked
            }));
            
            // If they passed a new scenario, show a toast
            if (unlocked.length > state.unlockedScenarios.length) {
              toast({
                title: "New Scenario Unlocked!",
                description: "You've unlocked a new training scenario.",
                variant: "default",
              });
            }
          }
        }
        
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
      const newTranscript = [...updatedTranscript, customerStep];
      
      // Calculate running average score for the current scenario
      const scoredResponses = newTranscript
        .filter(step => step.speaker === "Agent" && step.score !== undefined)
        .map(step => step.score as number);
      
      const totalScore = scoredResponses.reduce((sum, score) => sum + score, 0);
      const averageScore = scoredResponses.length > 0 
        ? Math.round(totalScore / scoredResponses.length) 
        : null;
      
      setState(prev => ({
        ...prev,
        transcript: newTranscript,
        currentStep: prev.currentStep + 1,
        isLoading: false,
        currentScore: agentStep.score || null,
        averageScore: averageScore
      }));
      
      // Generate audio for customer response
      await generateAudioForMessage(customerResponse.message);
      
    } catch (error) {
      console.error("Error in conversation flow:", error);
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
      
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
      if (state.isPlaying) {
        audioRef.current.pause();
        setState(prev => ({ ...prev, isPlaying: false }));
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          toast({
            title: "Playback Error",
            description: "There was an error playing the audio. Please try again.",
            variant: "destructive",
          });
        });
        setState(prev => ({ ...prev, isPlaying: true }));
      }
    } else if (state.transcript.length > 0) {
      // If audio doesn't exist yet, generate it for the current message
      const lastCustomerMessage = state.transcript.filter(step => step.speaker === "Customer").pop();
      if (lastCustomerMessage) {
        generateAudioForMessage(lastCustomerMessage.message);
      }
    }
  };

  // Generate audio for a message
  const generateAudioForMessage = async (message: string) => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        audioUrl: null
      }));
      
      const audioUrl = await textToSpeech({
        text: message,
        voiceId: voices.rachel, // Using the Rachel voice for customer
      });
      
      setState(prev => ({
        ...prev,
        audioUrl: audioUrl,
        isLoading: false
      }));
      
      // Auto-play the audio if needed
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
        setState(prev => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
      
      toast({
        title: "Audio Generation Failed",
        description: "Could not generate the customer's voice. Please check your API key.",
        variant: "destructive",
      });
    }
  };

  // Reset simulation
  const resetSimulation = () => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentStep: 0,
      transcript: [],
      isLoading: false,
      audioUrl: null,
      selectedScenario: null,
      callStatus: 'selecting',
      feedbackMessage: null,
      currentScore: null,
      averageScore: null
    }));
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };

  // Update audio element when audioUrl changes
  useEffect(() => {
    if (audioRef.current && state.audioUrl) {
      audioRef.current.src = state.audioUrl;
      audioRef.current.onended = () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      };
    }
  }, [state.audioUrl]);

  // Get the most recent customer message for display
  const getCurrentCustomerMessage = () => {
    const customerMessages = state.transcript.filter(step => step.speaker === "Customer");
    return customerMessages.length > 0 ? customerMessages[customerMessages.length - 1] : null;
  };
  
  // Generate response options based on scenario and step
  const getResponseOptions = () => {
    if (!state.selectedScenario) return [];
    
    // Default options based on scenario type
    switch (state.selectedScenario.id) {
      case "flightCancellation":
        if (state.currentStep === 1) {
          return [
            "I understand this is urgent. Let me help you cancel that flight. Can I get your booking reference?",
            "I'm sorry to hear that. I can help you with the cancellation. Do you have your booking details?",
            "Sure, I can cancel that for you. Let me explain our cancellation policy first."
          ];
        } else if (state.currentStep === 2) {
          return [
            "Thank you for providing that information. Let me check our system for your booking.",
            "I've found your booking. There will be a $150 cancellation fee as per our policy.",
            "I see your booking. Since this is an emergency, I can process this right away."
          ];
        } else if (state.currentStep >= 3) {
          return [
            "The cancellation has been processed. You'll receive a refund within 7-10 business days.",
            "I've completed the cancellation and sent a confirmation email. Is there anything else you need?",
            "Your flight has been cancelled. The refund minus the cancellation fee will be processed shortly."
          ];
        }
        break;
        
      case "bookingModification":
        if (state.currentStep === 1) {
          return [
            "I'd be happy to help you modify your booking. Can you please provide your booking reference?",
            "Sure, I can help with that. What dates would you like to change to?",
            "Let me check what options we have available for your booking modification."
          ];
        } else if (state.currentStep === 2) {
          return [
            "I see your booking. The change fee will be $50 plus any fare difference.",
            "Those dates are available. Would you like me to proceed with the change?",
            "I can add the meal preference to your booking. Is there anything else you'd like to modify?"
          ];
        } else if (state.currentStep >= 3) {
          return [
            "Your booking has been updated. You'll receive a confirmation email shortly.",
            "The changes have been made successfully. Your new total is $320.",
            "I've updated everything as requested. Is there anything else you need assistance with?"
          ];
        }
        break;
        
      case "refundRequest":
        if (state.currentStep === 1) {
          return [
            "I can help you with that refund request. May I have your booking reference?",
            "I'd be happy to process your refund. Can you confirm when the cancellation was made?",
            "Let me check our refund policy for your booking type. Do you have your cancellation confirmation?"
          ];
        } else if (state.currentStep === 2) {
          return [
            "Thank you for that information. Your refund will be processed within 14 business days.",
            "I've found your booking. The refund will be sent to your original payment method.",
            "According to our policy, you're eligible for a full refund. I'll process that right away."
          ];
        } else if (state.currentStep >= 3) {
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

  return {
    state,
    audioRef,
    startScenario,
    handleOptionClick,
    handlePlayPause,
    resetSimulation,
    getCurrentCustomerMessage,
    getResponseOptions
  };
}
