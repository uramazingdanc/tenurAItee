import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
function handleCORS(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
}

// Find relevant knowledge base articles based on message
async function findRelevantKnowledgeArticles(message: string, supabase: any) {
  try {
    // In a real implementation, this would use vector search or semantic search
    // For now, we'll use keyword matching as a simple demonstration
    const keywords = [
      { word: 'cancel', category: 'Cancellations' },
      { word: 'refund', category: 'Refunds' },
      { word: 'money back', category: 'Refunds' },
      { word: 'flight', category: 'Cancellations' },
      { word: 'conflict', category: 'Conflict Resolution' },
      { word: 'angry', category: 'Conflict Resolution' },
      { word: 'modify', category: 'Modifications' },
      { word: 'change', category: 'Modifications' },
    ];
    
    // Find matching categories
    const messageLower = message.toLowerCase();
    const matchingCategories = keywords
      .filter(k => messageLower.includes(k.word))
      .map(k => k.category);
    
    // If no matches, return empty array
    if (matchingCategories.length === 0) {
      return [];
    }
    
    // Query knowledge items from matching categories
    const { data, error } = await supabase
      .from('knowledge_items')
      .select('id, title, content, category')
      .in('category', [...new Set(matchingCategories)])
      .limit(2);
    
    if (error) throw error;
    
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      excerpt: item.content.substring(0, 120) + '...',
      url: `/knowledge/${item.id}`
    }));
  } catch (error) {
    console.error('Error finding knowledge articles:', error);
    return [];
  }
}

// Generate chat suggestions based on OpenAI response
function generateChatSuggestions(message: string, aiResponse: string, userContext?: any) {
  // If we have user context (progress, performance data, etc.)
  if (userContext) {
    // Generate suggestions that are personalized to the user's progress
    const weakAreas = userContext.improvement_areas || [];
    const completedScenarios = userContext.completedScenarios || [];
    
    // If user has weak areas in customer satisfaction or empathy
    if (weakAreas.includes("customer_satisfaction") || weakAreas.includes("empathy")) {
      return [
        { id: "p1", text: "How can I improve my empathy in calls?" },
        { id: "p2", text: "Show me scripts for handling upset customers" },
        { id: "p3", text: "What phrases should I avoid with angry customers?" }
      ];
    }
    
    // If user has weak areas in knowledge or accuracy
    if (weakAreas.includes("product_knowledge") || weakAreas.includes("response_accuracy")) {
      return [
        { id: "k1", text: "Show me the latest refund policy" },
        { id: "k2", text: "What exceptions apply to the 24-hour cancellation policy?" },
        { id: "k3", text: "How do I handle refund requests for premium tickets?" }
      ];
    }
    
    // Default scenario suggestions
    return [
      { id: "s1", text: "I'd like to practice a refund scenario" },
      { id: "s2", text: "Help me prepare for difficult customer interactions" },
      { id: "s3", text: "How can I improve my last call score?" }
    ];
  }

  // Default suggestions (original behavior if no user context)
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('cancel') || messageLower.includes('flight')) {
    return [
      { id: "4", text: "What's our flight cancellation policy?" },
      { id: "5", text: "How do I process a refund for a cancelled flight?" }
    ];
  } else if (messageLower.includes('refund')) {
    return [
      { id: "6", text: "What information do I need to process a refund?" },
      { id: "7", text: "How long do refunds typically take?" }
    ];
  } else if (messageLower.includes('angry') || messageLower.includes('upset')) {
    return [
      { id: "8", text: "Show me de-escalation techniques" },
      { id: "9", text: "How should I respond to customers using profanity?" }
    ];
  }
  
  return [
    { id: "1", text: "Show me training scenarios" },
    { id: "2", text: "How do I improve my customer satisfaction score?" },
    { id: "3", text: "What are best practices for handling angry customers?" }
  ];
}

// Generate AI insights based on user performance data
async function generateAIInsights(message: string, userContext: any, openAIApiKey: string) {
  if (!userContext) return null;
  
  try {
    const promptForInsights = `
      You are an AI coaching assistant for customer service agents.
      
      Agent Performance Data:
      - Name: ${userContext.name || "Agent"} 
      - Experience Level: ${userContext.current_level || "1"} 
      - Recent Score: ${userContext.last_score || "N/A"}
      - Strengths: ${userContext.strengths?.join(", ") || "N/A"}
      - Areas for Improvement: ${userContext.improvement_areas?.join(", ") || "N/A"}
      - Recent call topics: ${userContext.recent_topics?.join(", ") || "refunds, cancellations"}
      
      Based on this user's message: "${message}"
      
      Generate ONE specific, actionable insight to help this agent improve their skills.
      Make it personalized, specific, and directly related to their performance data.
      Keep it under 2 sentences and be encouraging.
    `;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: promptForInsights },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.choices[0].message.content.trim();
    }
    
    return null;
  } catch (error) {
    console.error("Error generating insights:", error);
    return null;
  }
}

// Generate AI response using OpenAI GPT-4o mini
async function generateAIResponse(message: string, history: any[], knowledgeArticles: any[], userContext?: any) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    console.error("OpenAI API key is not set");
    throw new Error("OpenAI API key is not set");
  }
  
  try {
    // Format the conversation history for OpenAI
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Create system message with context for the AI
    let systemMessage = 
      "You are an AI coach for customer service training named 'Tenured AI Assistant'. " +
      "You help customer service agents improve their skills through interactive training. " +
      "Your tone is professional, supportive, and encouraging. " +
      "Provide concise, helpful advice based on best practices in customer service. " +
      "Focus on de-escalation, empathy, and effective problem-solving techniques.";
    
    // Add personalized context if available
    if (userContext) {
      systemMessage += `\n\nAgent Context:
      - Name: ${userContext.name || "Agent"} 
      - Experience Level: ${userContext.current_level || 1}
      - Recent Performance: ${userContext.last_score ? userContext.last_score + "%" : "No recent data"}
      - Strengths: ${userContext.strengths?.join(", ") || "Not enough data"}
      - Areas for Improvement: ${userContext.improvement_areas?.join(", ") || "Not enough data"}
      
      When providing advice, focus specifically on helping them improve their weak areas.
      `;
    }
    
    // If we have knowledge articles, include them in the system message
    if (knowledgeArticles.length > 0) {
      systemMessage += "\n\nRelevant knowledge articles:";
      knowledgeArticles.forEach((article: any) => {
        systemMessage += `\n- ${article.title}: ${article.excerpt}`;
      });
      systemMessage += "\n\nRefer to these articles when appropriate in your response.";
    }
    
    // Prepare the messages array for OpenAI
    const messages = [
      { role: "system", content: systemMessage },
      ...formattedHistory,
      { role: "user", content: message }
    ];
    
    console.log("Sending request to OpenAI with messages:", JSON.stringify(messages));
    
    // Call the OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    console.log("OpenAI response:", data);
    
    // Extract the assistant's response
    const aiResponse = data.choices[0].message.content;
    return aiResponse;
    
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I'm sorry, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}

// Record chat message to database
async function recordChatMessage(
  supabase: any, 
  userId: string, 
  sessionId: string, 
  message: string, 
  role: 'user' | 'assistant',
  knowledgeArticles: any[] = [],
  suggestions: any[] = []
) {
  try {
    const { data, error } = await supabase
      .from('ai_chat_history')
      .insert({
        user_id: userId,
        session_id: sessionId,
        message,
        role,
        kb_articles: knowledgeArticles.length > 0 ? knowledgeArticles : null,
        suggestions: suggestions.length > 0 ? suggestions : null
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error recording chat message:", error);
    // Continue even if recording fails
  }
}

// Update user's XP and streak
async function updateUserProgress(supabase: any, userId: string, xpToAdd: number = 5) {
  try {
    // Get the current user progress
    const { data: existingData, error: fetchError } = await supabase
      .from('agent_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (fetchError) throw fetchError;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentStreak = 0;
    let lastActivity = new Date();
    
    if (existingData) {
      // User has existing progress
      const lastActivityDate = new Date(existingData.last_activity_date);
      lastActivityDate.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Calculate the new streak
      if (lastActivityDate.getTime() === yesterday.getTime()) {
        // User was active yesterday, increment streak
        currentStreak = existingData.current_streak + 1;
      } else if (lastActivityDate.getTime() === today.getTime()) {
        // User was already active today, maintain streak
        currentStreak = existingData.current_streak;
      } else {
        // User missed days, reset streak
        currentStreak = 1;
      }
      
      // Update the user's progress
      const { data, error: updateError } = await supabase
        .from('agent_progress')
        .update({
          xp_points: existingData.xp_points + xpToAdd,
          current_streak: currentStreak,
          last_activity_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();
        
      if (updateError) throw updateError;
      return data;
    } else {
      // First time user, create progress record
      const { data, error: insertError } = await supabase
        .from('agent_progress')
        .insert({
          user_id: userId,
          xp_points: xpToAdd,
          current_streak: 1,
          current_level: 1,
          last_activity_date: new Date().toISOString()
        })
        .select();
        
      if (insertError) throw insertError;
      return data;
    }
  } catch (error) {
    console.error("Error updating user progress:", error);
    // Continue even if update fails
  }
}

// Fetch user context for personalization
async function fetchUserContext(supabase: any, userId: string) {
  try {
    // Get user's profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) throw profileError;
    
    // Get user's progress
    const { data: progressData, error: progressError } = await supabase
      .from('agent_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (progressError && progressError.code !== 'PGRST116') throw progressError;
    
    // Get user's performance data
    const { data: performanceData, error: performanceError } = await supabase
      .from('agent_performance')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (performanceError && performanceError.code !== 'PGRST116') throw performanceError;
    
    // Get user's completed scenarios
    const { data: completedScenarios, error: scenariosError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
      .limit(5);
      
    if (scenariosError && scenariosError.code !== 'PGRST116') throw scenariosError;
    
    // Create a consolidated context object
    const userContext = {
      name: profileData?.full_name || profileData?.email || "Agent",
      current_level: progressData?.current_level || 1,
      last_score: performanceData?.customer_satisfaction || null,
      strengths: performanceData?.strengths || [],
      improvement_areas: performanceData?.improvement_areas || [],
      completedScenarios: completedScenarios || [],
    };
    
    return userContext;
  } catch (error) {
    console.error("Error fetching user context:", error);
    return null;
  }
}

// Main handler function
serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;
  
  // Create Supabase client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
  const openAIApiKey = Deno.env.get("OPENAI_API_KEY") as string;
  
  // For authenticating the user
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'Missing Authorization header' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Create Supabase client with the JWT token
  // @ts-ignore: Expected for Supabase import to be recognized in edge functions
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  
  // Create admin client for operations needing higher privileges
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }
    
    // Parse the request
    const { 
      message, 
      history = [],
      sessionId = crypto.randomUUID(),
      includeUserContext = false
    } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }
    
    // Update the user's XP and streak
    await updateUserProgress(supabaseAdmin, user.id);
    
    // Fetch user context for personalization if requested
    let userContext = null;
    if (includeUserContext) {
      userContext = await fetchUserContext(supabaseAdmin, user.id);
    }
    
    // Find relevant knowledge articles
    const knowledgeArticles = await findRelevantKnowledgeArticles(message, supabaseAdmin);
    
    // Record the user's message
    await recordChatMessage(
      supabaseAdmin,
      user.id,
      sessionId,
      message,
      'user'
    );
    
    // Generate AI response using OpenAI
    const aiResponse = await generateAIResponse(message, history, knowledgeArticles, userContext);
    
    // Generate AI insights if user context is available
    let insights = null;
    if (userContext) {
      insights = await generateAIInsights(message, userContext, openAIApiKey);
    }
    
    // Generate chat suggestions based on the AI response and message
    const suggestions = generateChatSuggestions(message, aiResponse, userContext);
    
    // Record the assistant's response
    await recordChatMessage(
      supabaseAdmin,
      user.id,
      sessionId,
      aiResponse,
      'assistant',
      knowledgeArticles,
      suggestions
    );
    
    return new Response(
      JSON.stringify({
        response: aiResponse,
        suggestions: suggestions.map(s => s.text),
        kb_articles: knowledgeArticles,
        insights,
        sessionId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error processing AI chat request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: error.message === 'Unauthorized' ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
