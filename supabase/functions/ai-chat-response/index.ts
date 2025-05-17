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
    
    // Call OpenAI API
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
          
        console.log('Successfully logged chat interaction');
      } catch (dbError) {
        // Just log the error but don't fail the whole request
        console.error('Failed to log interaction:', dbError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        message: aiResponse,
        emotion: emotion
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
