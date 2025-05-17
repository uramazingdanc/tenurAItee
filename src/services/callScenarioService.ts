
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
  agentResponse: string,
  userId?: string  // Add userId parameter to log this interaction
): Promise<{ message: string, emotion: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat-response', {
      body: {
        scenario: scenarioId,
        step: currentStep,
        history: conversationHistory,
        agentResponse,
        userId // Pass user ID for logging purposes
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

// Function to save call progress to the database
export const saveCallProgress = async (userId: string | undefined, scenarioId: string, transcript: any[], score?: number) => {
  if (!userId) return { success: false, error: 'User not authenticated' };
  
  try {
    // Save to Supabase database
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        scenario_id: scenarioId,
        score,
        completed: true,
        feedback: JSON.stringify(transcript.filter(t => t.speaker === 'Agent').map(t => t.message))
      }, {
        onConflict: 'user_id,scenario_id'
      });

    if (error) throw error;
    
    // Update agent_progress to add XP
    try {
      // First get the current progress
      const { data: progressData } = await supabase
        .from('agent_progress')
        .select('xp_points, current_level, current_streak')
        .eq('user_id', userId)
        .single();

      if (progressData) {
        // Update with new XP
        await supabase
          .from('agent_progress')
          .update({
            xp_points: progressData.xp_points + 25, // Award 25 XP per completed scenario
            last_activity_date: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        // Create new progress entry if none exists
        await supabase
          .from('agent_progress')
          .insert({
            user_id: userId,
            xp_points: 25,
            current_level: 1,
            current_streak: 1,
            last_activity_date: new Date().toISOString()
          });
      }
    } catch (progressError) {
      console.error('Error updating progress:', progressError);
      // Don't fail the whole operation if progress update fails
    }
    
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
