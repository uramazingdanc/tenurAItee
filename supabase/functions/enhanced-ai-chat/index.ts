
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

// Generate chat suggestions based on message
function generateChatSuggestions(message: string) {
  // In a real implementation, this would use a more sophisticated algorithm or AI model
  const messageLower = message.toLowerCase();
  
  const defaultSuggestions = [
    { id: "1", text: "Show me training scenarios" },
    { id: "2", text: "How do I improve my customer satisfaction score?" },
    { id: "3", text: "What are best practices for handling angry customers?" }
  ];
  
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
  
  return defaultSuggestions;
}

// Generate AI response to user message
async function generateAIResponse(message: string, history: any[], knowledgeArticles: any[]) {
  // In a real implementation, this would call OpenAI or another LLM
  // For now, we'll use a simple response generation logic based on keywords
  const messageLower = message.toLowerCase();
  
  let response = "";
  
  if (messageLower.includes('help')) {
    response = "I can help you with training scenarios, answer questions about customer service techniques, or provide feedback on your past performance. What would you like assistance with?";
  } 
  else if (messageLower.includes('scenario') || messageLower.includes('training')) {
    response = "We have several scenarios available for practice. The 'Flight Cancellation' scenario is recommended for beginners. Would you like to try it?";
  } 
  else if (messageLower.includes('progress') || messageLower.includes('score')) {
    response = "You're making great progress! You've completed 65% of your current level. Your customer satisfaction rating is above average. Keep practicing the de-escalation techniques to improve further.";
  } 
  else if (messageLower.includes('badge') || messageLower.includes('achievement')) {
    response = "You currently have 8 badges. To earn the 'Knowledge Master' badge, you'll need to read all the basic knowledge articles.";
  }
  else if (messageLower.includes('refund') || messageLower.includes('money back')) {
    response = "When handling refund requests, always verify the customer's eligibility first according to our policy. I've highlighted some relevant knowledge articles that might help.";
  }
  else if (messageLower.includes('streak')) {
    response = "You're on a 5-day learning streak! Keep it up and you'll earn bonus XP. Try to complete at least one scenario each day to maintain your streak.";
  }
  else if (messageLower.includes('level')) {
    response = "You're currently at Level 3: Advanced Agent. You need 2,500 more XP to reach Level 4, which will unlock additional advanced scenarios and special badges.";
  }
  else {
    response = "That's an interesting question. I'd recommend practicing with more scenarios to improve in that area. Is there a specific skill you'd like to focus on?";
  }
  
  // If we have knowledge articles, mention them
  if (knowledgeArticles.length > 0) {
    response += " I've found some knowledge articles that might be helpful for you.";
  }
  
  return response;
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

// Main handler function
serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;
  
  // Create Supabase client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
  
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
      sessionId = crypto.randomUUID()
    } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }
    
    // Update the user's XP and streak
    await updateUserProgress(supabaseAdmin, user.id);
    
    // Find relevant knowledge articles
    const knowledgeArticles = await findRelevantKnowledgeArticles(message, supabaseAdmin);
    
    // Generate chat suggestions
    const suggestions = generateChatSuggestions(message);
    
    // Record the user's message
    await recordChatMessage(
      supabaseAdmin,
      user.id,
      sessionId,
      message,
      'user'
    );
    
    // Generate AI response
    const aiResponse = await generateAIResponse(message, history, knowledgeArticles);
    
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
