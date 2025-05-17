
import { supabase } from '@/integrations/supabase/client';

export interface CallStep {
  id: number;
  speaker: 'Customer' | 'Agent' | 'System';
  message: string;
  emotion?: string;
  options?: string[];
}

export interface CallScenario {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: CallStep[];
}

// Define the initial scenarios
export const getScenarioById = (scenarioId: string): CallScenario | undefined => {
  return SCENARIOS.find(s => s.id === scenarioId);
};

// Initialize predefined scenarios with initial steps
export const SCENARIOS: CallScenario[] = [
  {
    id: "flightCancellation",
    title: "Flight Cancellation",
    description: "Customer requests emergency flight cancellation.",
    duration: 5,
    difficulty: "Beginner",
    steps: [
      {
        id: 1,
        speaker: "Customer",
        message: "Hello, I need to cancel my flight due to a family emergency.",
        emotion: "concerned"
      }
    ]
  },
  {
    id: "bookingModification",
    title: "Booking Modification",
    description: "Customer wants to change travel dates and add special requests.",
    duration: 10,
    difficulty: "Intermediate",
    steps: [
      {
        id: 1,
        speaker: "Customer",
        message: "Hi, I need to modify my booking. Can I change my flight dates and add meal preferences?",
        emotion: "neutral"
      }
    ]
  },
  {
    id: "refundRequest",
    title: "Refund Request",
    description: "Customer wants to request a refund for a cancelled service.",
    duration: 10,
    difficulty: "Intermediate",
    steps: [
      {
        id: 1,
        speaker: "Customer",
        message: "Good morning, I want to request a refund for my cancelled hotel booking.",
        emotion: "neutral"
      }
    ]
  }
];

// Function to generate the next customer response
export const generateNextCustomerResponse = async (
  scenarioId: string,
  currentStep: number,
  conversationHistory: any[],
  agentResponse: string
): Promise<{ message: string, emotion: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat-response', {
      body: {
        scenario: scenarioId,
        step: currentStep,
        history: conversationHistory,
        agentResponse
      }
    });

    if (error) throw error;
    
    return {
      message: data.message,
      emotion: data.emotion || 'neutral'
    };
  } catch (error) {
    console.error('Error generating next customer response:', error);
    return {
      message: "I'm sorry, I'm having trouble understanding. Could you please clarify?",
      emotion: "confused"
    };
  }
};

// Function to save call progress - in a real app this would save to your database
export const saveCallProgress = async (userId: string | undefined, scenarioId: string, transcript: any[], score?: number) => {
  if (!userId) return { success: false, error: 'User not authenticated' };
  
  try {
    // This is a placeholder for actual database integration
    console.log(`Saving progress for user ${userId} on scenario ${scenarioId}`);
    console.log('Transcript:', transcript);
    console.log('Score:', score);
    
    return { success: true };
  } catch (error) {
    console.error('Error saving call progress:', error);
    return { success: false, error: String(error) };
  }
};

// Function to generate AI feedback on the call
export const generateCallFeedback = async (scenarioId: string, transcript: any[]): Promise<string> => {
  // In a real implementation, this would call another edge function to generate feedback
  return "Based on this simulation, consider working on more empathetic responses and clearer policy explanations.";
};
