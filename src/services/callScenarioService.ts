import { supabase } from '@/integrations/supabase/client';

export interface CallStep {
  id: number;
  speaker: 'Customer' | 'Agent' | 'System';
  message: string;
  emotion?: string;
  options?: string[];
  score?: number;
  feedback?: string;
}

export interface CallScenario {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: CallStep[];
  unlocked?: boolean;
  passingScore?: number;
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
    passingScore: 70,
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
    passingScore: 75,
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
    passingScore: 80,
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
): Promise<{ message: string, emotion: string, score?: number, feedback?: string }> => {
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
      emotion: data.emotion || 'neutral',
      score: data.score,
      feedback: data.feedback
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
    // Calculate average score from responses that have scores
    const agentResponses = transcript.filter(t => t.speaker === 'Agent' && t.score);
    const totalScore = agentResponses.reduce((sum, response) => sum + response.score, 0);
    const averageScore = agentResponses.length > 0 ? Math.round(totalScore / agentResponses.length) : score || 0;
    
    // Get the passing score for this scenario
    const scenarioConfig = SCENARIOS.find(s => s.id === scenarioId);
    const passingScore = scenarioConfig?.passingScore || 70;
    
    // Determine if the scenario was passed
    const passed = averageScore >= passingScore;
    
    // First, check if the user_progress table has the 'passed' column
    const { data: tableInfo } = await supabase
      .from('user_progress')
      .select('*')
      .limit(1);
    
    // If the table exists and we have data, try to save the progress
    if (tableInfo) {
      // Save to Supabase database
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          scenario_id: scenarioId,
          score: averageScore,
          completed: true,
          passed: passed,
          feedback: JSON.stringify(transcript.filter(t => t.speaker === 'Agent').map(t => t.message))
        }, {
          onConflict: 'user_id,scenario_id'
        });

      if (error) {
        console.error("Error saving progress:", error);
        // If there's an error related to a missing 'passed' column, try to run the update function
        if (error.message && error.message.includes("passed")) {
          try {
            await supabase.functions.invoke('update-user-progress-table');
            // Try the upsert again after updating the table
            const { error: retryError } = await supabase
              .from('user_progress')
              .upsert({
                user_id: userId,
                scenario_id: scenarioId,
                score: averageScore,
                completed: true,
                passed: passed,
                feedback: JSON.stringify(transcript.filter(t => t.speaker === 'Agent').map(t => t.message))
              }, {
                onConflict: 'user_id,scenario_id'
              });
            
            if (retryError) throw retryError;
          } catch (funcError) {
            console.error("Error updating table:", funcError);
            throw funcError;
          }
        } else {
          throw error;
        }
      }
    }
    
    // Update agent_progress to add XP
    try {
      // Calculate XP based on score - better scores give more XP
      const xpAward = passed ? Math.round(25 + (averageScore - passingScore) * 0.5) : 10;
      
      // Get the current progress
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
            xp_points: progressData.xp_points + xpAward, // Award XP based on score
            last_activity_date: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        // Create new progress entry if none exists
        await supabase
          .from('agent_progress')
          .insert({
            user_id: userId,
            xp_points: passed ? 25 : 10,
            current_level: 1,
            current_streak: 1,
            last_activity_date: new Date().toISOString()
          });
      }
    } catch (progressError) {
      console.error('Error updating progress:', progressError);
      // Don't fail the whole operation if progress update fails
    }
    
    return { 
      success: true, 
      averageScore,
      passed,
      passingScore
    };
  } catch (error) {
    console.error('Error saving call progress:', error);
    return { success: false, error: String(error) };
  }
};

// Function to get user's unlocked scenarios
export const getUnlockedScenarios = async (userId: string): Promise<string[]> => {
  if (!userId) return ["flightCancellation"]; // Always unlock the first scenario
  
  try {
    // Check if the user_progress table has the 'passed' column
    try {
      // Try to run the update function to ensure the 'passed' column exists
      await supabase.functions.invoke('update-user-progress-table');
    } catch (e) {
      console.warn("Could not update user_progress table, continuing anyway:", e);
    }
    
    // Get completed scenarios with passing scores
    const { data, error } = await supabase
      .from('user_progress')
      .select('scenario_id, completed, score')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Get IDs of passed scenarios (we'll consider any completed scenario as "passed" if the passed column doesn't exist)
    const passedScenarioIds = data
      ?.filter(progress => progress.completed && (progress.score >= 70))
      .map(progress => progress.scenario_id) || [];
    
    // Always include the first scenario
    if (!passedScenarioIds.includes("flightCancellation")) {
      passedScenarioIds.push("flightCancellation");
    }
    
    // Determine which additional scenarios to unlock based on progression
    const allScenarioIds = SCENARIOS.map(s => s.id);
    const unlockedScenarios: string[] = [];
    
    // For each scenario in our ordered list
    for (let i = 0; i < allScenarioIds.length; i++) {
      const currentId = allScenarioIds[i];
      
      // Always include the first scenario
      if (i === 0) {
        unlockedScenarios.push(currentId);
        continue;
      }
      
      // If they passed the previous scenario, unlock this one
      const previousId = allScenarioIds[i - 1];
      if (passedScenarioIds.includes(previousId)) {
        unlockedScenarios.push(currentId);
      } else {
        // Stop once we hit a scenario they haven't unlocked
        break;
      }
    }
    
    return unlockedScenarios;
  } catch (error) {
    console.error('Error getting unlocked scenarios:', error);
    return ["flightCancellation"]; // Default to just the first scenario
  }
};

// Function to generate AI feedback on the call
export const generateCallFeedback = async (scenarioId: string, transcript: any[]): Promise<string> => {
  try {
    // Get scores from the transcript
    const scores = transcript
      .filter(step => step.speaker === 'Agent' && step.score)
      .map(step => step.score);
    
    const averageScore = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;
    
    const scenarioConfig = SCENARIOS.find(s => s.id === scenarioId);
    const passingScore = scenarioConfig?.passingScore || 70;
    const passed = averageScore >= passingScore;
    
    // Combine agent responses and feedback
    const feedbackPoints = transcript
      .filter(step => step.speaker === 'Agent' && step.feedback)
      .map(step => step.feedback);
    
    // Generate a comprehensive feedback message
    if (passed) {
      return `Congratulations! You've successfully passed this scenario with an average score of ${Math.round(averageScore)}%. ${feedbackPoints.length > 0 ? 'Here are some specific points from your performance: ' + feedbackPoints.join(' ') : 'Continue practicing to perfect your skills.'}`;
    } else {
      return `You've completed this scenario with an average score of ${Math.round(averageScore)}%, but the passing threshold is ${passingScore}%. ${feedbackPoints.length > 0 ? 'Here are some areas for improvement: ' + feedbackPoints.join(' ') : 'Keep practicing and try incorporating more empathy and clear communication in your responses.'}`;
    }
  } catch (error) {
    console.error('Error generating call feedback:', error);
    return "Based on this simulation, consider working on more empathetic responses and clearer policy explanations.";
  }
};
