import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scenario, step, history, agentResponse, userId } = await req.json();
    
    if (!scenario) {
      throw new Error('Scenario type is required');
    }
    
    // Get API key from environment variable
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate the system prompt based on scenario
    const systemPrompt = generateSystemPrompt(scenario);
    
    // Format conversation history for OpenAI
    const messages = [
      { role: "system", content: systemPrompt },
      ...formatConversationHistory(history, step, agentResponse)
    ];
    
    console.log('Sending request to OpenAI with context:', JSON.stringify({
      scenario,
      step,
      historyLength: history.length
    }));
    
    // Call OpenAI API to generate customer response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || JSON.stringify(error)}`);
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Determine emotion based on content analysis
    const emotion = determineEmotion(aiResponse, step);

    // Score the agent's response if it's not the first step
    let responseScore = null;
    let responseFeedback = null;
    
    if (agentResponse && step > 1) {
      // Use a separate API call to ensure we always get feedback
      const scoreData = await scoreAgentResponse(apiKey, history, agentResponse, scenario);
      responseScore = scoreData.score;
      responseFeedback = scoreData.feedback;
      
      console.log('Agent response scored:', responseScore, responseFeedback);
    }

    // If userId is provided, log this interaction to the database
    if (userId) {
      try {
        // Create Supabase client with service role key for admin operations
        const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
        
        // @ts-ignore: Expected for Supabase import to be recognized in edge functions
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        
        // Log this interaction in the database
        await supabaseAdmin
          .from('ai_chat_history')
          .insert({
            user_id: userId,
            role: "assistant",
            message: aiResponse,
            session_id: history.length > 0 ? history[0].sessionId : null,
          });
        
        // If we have a score, save it to the scenario_response_scores table
        if (responseScore !== null && userId) {
          await supabaseAdmin
            .from('scenario_response_scores')
            .insert({
              user_id: userId,
              scenario_id: scenario,
              step: step,
              score: responseScore,
              feedback: responseFeedback,
              agent_response: agentResponse
            });
        }
          
        console.log('Successfully logged chat interaction and score');
      } catch (dbError) {
        // Just log the error but don't fail the whole request
        console.error('Failed to log interaction:', dbError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        message: aiResponse,
        emotion: emotion,
        score: responseScore,
        feedback: responseFeedback
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in ai-chat-response function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Score the agent's response using GPT-4o mini
async function scoreAgentResponse(apiKey: string, history: any[], agentResponse: string, scenario: string): Promise<{ score: number, feedback: string }> {
  try {
    // Construct the prompt for scoring
    const conversationContext = history
      .map(item => `${item.speaker}: ${item.message}`)
      .join('\n');
    
    const scoringPrompt = `
You are an AI evaluator assessing a customer service agent's response quality in a ${scenario} scenario.

Conversation context:
${conversationContext}

Agent's latest response: "${agentResponse}"

Score the response on a scale of 0 to 100 based on:
- Accuracy of information
- Empathy and tone
- Clarity and professionalism
- Completeness of answer
- Adherence to company policies

Return ONLY JSON with the following format:
{
  "score": <number>,
  "feedback": "<brief constructive feedback>"
}

The feedback MUST contain specific actionable advice on how to improve the response. Be specific and detailed.
`;

    // Make a separate API call with a specific focus on generating feedback
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: "system", 
            content: "You are an expert customer service trainer that evaluates agent responses. Always provide detailed feedback with specific improvement suggestions." 
          },
          { role: "user", content: scoringPrompt }
        ],
        max_tokens: 300, // Increased max tokens to allow for more detailed feedback
        temperature: 0.3  // Reduced temperature for more consistent outputs
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || JSON.stringify(error)}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log("Feedback generation raw response:", content);
    
    // Parse JSON from the content
    try {
      // Find JSON object in the response text
      const jsonMatch = content.match(/({[\s\S]*})/);
      if (jsonMatch) {
        const scoreData = JSON.parse(jsonMatch[0]);
        
        // Validate the response contains required fields
        if (!scoreData.score) {
          throw new Error('Missing score in response');
        }
        
        return {
          score: Math.round(scoreData.score) || 0,
          feedback: scoreData.feedback || "No specific feedback available."
        };
      }
      
      // If JSON parsing fails, try to extract score and feedback from the text
      const scoreMatch = content.match(/score[\"'\s]*[:=][\"'\s]*(\d+)/i);
      const feedbackMatch = content.match(/feedback[\"'\s]*[:=][\"'\s]*["']([^"']+)["']/i);
      
      if (scoreMatch) {
        return {
          score: parseInt(scoreMatch[1]) || 50,
          feedback: feedbackMatch ? feedbackMatch[1] : "Could not parse specific feedback."
        };
      }
      
      // Fallback if JSON parsing fails
      return {
        score: 50, // Default middle score
        feedback: "The response was average. Consider adding more specific details and showing more empathy."
      };
    } catch (parseError) {
      console.error('Failed to parse score data:', parseError, 'Raw content:', content);
      return {
        score: 50, // Default middle score
        feedback: "Could not generate specific feedback. Try to be more clear and empathetic in your customer service responses."
      };
    }
  } catch (error) {
    console.error('Error scoring agent response:', error);
    return {
      score: 50, // Default middle score
      feedback: "Error generating feedback. Focus on clarity, accuracy, and empathy in your customer service responses."
    };
  }
}

function generateSystemPrompt(scenario: string): string {
  let basePrompt = "You are a customer in a simulated call with a customer service agent. ";
  
  switch(scenario) {
    case "flightCancellation":
      return basePrompt + "You need to cancel your flight due to a family emergency. You're concerned about the refund policy and want to know how quickly the cancellation can be processed. Be polite but show an appropriate level of urgency. Your flight is scheduled for tomorrow.";
      
    case "bookingModification":
      return basePrompt + "You want to modify your existing booking to change travel dates and add special meal requests. You're open to paying reasonable fees but want to understand all options. You have specific dates in mind (two weeks later than original booking) and need vegetarian meals.";
      
    case "refundRequest":
      return basePrompt + "You're requesting a refund for a hotel booking that was cancelled. You have the booking confirmation and cancellation reference. You want to know how long the refund will take to process and if there are any specific steps you need to follow.";
      
    default:
      return basePrompt + "You have a general customer service inquiry and are looking for assistance.";
  }
}

function formatConversationHistory(history: any[], currentStep: number, agentResponse: string | null): { role: string, content: string }[] {
  const messages: { role: string, content: string }[] = [];
  
  // Add previous conversation history if available
  if (history && history.length > 0) {
    history.forEach(item => {
      messages.push({ 
        role: item.speaker === "Customer" ? "assistant" : "user", 
        content: item.message 
      });
    });
  }
  
  // Add the agent's most recent response if available
  if (agentResponse) {
    messages.push({ role: "user", content: agentResponse });
  }
  
  return messages;
}

function determineEmotion(message: string, step: number): string {
  // Basic emotion detection based on message content and step progression
  if (message.toLowerCase().includes("emergency") || 
      message.toLowerCase().includes("urgent") || 
      message.toLowerCase().includes("immediately")) {
    return "concerned";
  }
  
  if (message.toLowerCase().includes("thank you") || 
      message.toLowerCase().includes("appreciate") || 
      message.toLowerCase().includes("grateful")) {
    return "pleased";
  }
  
  if (message.toLowerCase().includes("disappoint") || 
      message.toLowerCase().includes("frustrat") || 
      message.toLowerCase().includes("unhappy")) {
    return "upset";
  }
  
  // Default emotions based on step progression
  if (step > 4) {
    return "satisfied"; // Later in conversation, customer is typically more satisfied
  } else if (step > 2) {
    return "neutral"; // Mid conversation
  }
  
  return "neutral"; // Default
}
