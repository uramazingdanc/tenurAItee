
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

// Fetch agent progress information
async function getAgentProgress(supabase: any, userId: string) {
  try {
    // Get the progress data
    const { data: progressData, error: progressError } = await supabase
      .from('agent_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (progressError) throw progressError;
    
    if (!progressData) {
      // User doesn't have progress data yet, create default entry
      const { data: newProgressData, error: createError } = await supabase
        .from('agent_progress')
        .insert({
          user_id: userId,
          xp_points: 0,
          current_level: 1,
          current_streak: 0,
          last_activity_date: new Date().toISOString()
        })
        .select()
        .single();
        
      if (createError) throw createError;
      return newProgressData;
    }
    
    return progressData;
  } catch (error) {
    console.error("Error fetching agent progress:", error);
    throw error;
  }
}

// Calculate level based on XP
function calculateLevel(xpPoints: number) {
  // Implement level calculation logic
  // Example: Each level requires 1000 * level XP
  let totalXpRequired = 0;
  let level = 0;
  
  while (true) {
    level++;
    const xpForCurrentLevel = 1000 * level;
    totalXpRequired += xpForCurrentLevel;
    
    if (xpPoints < totalXpRequired) {
      return {
        level,
        currentXp: xpPoints - (totalXpRequired - xpForCurrentLevel),
        requiredXp: xpForCurrentLevel,
        totalXp: xpPoints
      };
    }
  }
}

// Fetch user achievements
async function getUserAchievements(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        id,
        earned_at,
        achievements:achievement_id (
          id,
          name,
          description,
          icon,
          category
        )
      `)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return data.map((item: any) => ({
      id: item.achievements.id,
      name: item.achievements.name,
      description: item.achievements.description,
      icon: item.achievements.icon,
      category: item.achievements.category,
      earned_at: item.earned_at
    }));
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    return [];
  }
}

// Fetch agent performance metrics
async function getAgentPerformance(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from('agent_performance')
      .select('*')
      .eq('user_id', userId)
      .order('period_end', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (error) throw error;
    
    if (!data) {
      // Return default performance metrics if none exist
      return {
        customer_satisfaction: 92,
        response_accuracy: 87,
        issue_resolution_rate: 78,
        improvement_areas: [
          { category: "skill", title: "Handling multiple requests at once" },
          { category: "knowledge", title: "Policy explanation clarity" }
        ],
        period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        period_end: new Date().toISOString()
      };
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching agent performance:", error);
    throw error;
  }
}

// Get completed and in-progress scenarios
async function getUserScenarios(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        id, 
        score,
        completed,
        feedback,
        scenarios:scenario_id (
          id,
          title,
          description,
          difficulty,
          category,
          is_premium
        )
      `)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Map the data to a more usable format
    const completedScenarios = data
      .filter((item: any) => item.completed)
      .map((item: any) => ({
        id: item.scenarios.id,
        title: item.scenarios.title,
        description: item.scenarios.description,
        difficulty: item.scenarios.difficulty,
        category: item.scenarios.category,
        is_premium: item.scenarios.is_premium,
        score: item.score
      }));
      
    const inProgressScenarios = data
      .filter((item: any) => !item.completed)
      .map((item: any) => ({
        id: item.scenarios.id,
        title: item.scenarios.title,
        description: item.scenarios.description,
        difficulty: item.scenarios.difficulty,
        category: item.scenarios.category,
        is_premium: item.scenarios.is_premium
      }));
      
    return { completedScenarios, inProgressScenarios };
  } catch (error) {
    console.error("Error fetching user scenarios:", error);
    return { completedScenarios: [], inProgressScenarios: [] };
  }
}

// Generate personalized recommendations
async function getRecommendations(supabase: any, userId: string) {
  try {
    // In a real implementation, we would use the agent's history, progress, and performance
    // to generate personalized recommendations
    // For now, we'll return some demo recommendations
    
    const recommendations = [
      {
        type: "video",
        title: "De-escalation Techniques",
        duration: "8 min",
        url: "/learning/de-escalation"
      },
      {
        type: "article",
        title: "Travel Insurance FAQ",
        duration: "5 min read",
        url: "/knowledge/travel-insurance-faq"
      },
      {
        type: "practice",
        title: "Handling Refund Requests",
        url: "/scenarios/refund-handling"
      }
    ];
    
    return recommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [];
  }
}

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
    
    // Parse URL path to determine which data to return
    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();
    
    let responseData = {};
    
    // Return different data based on the endpoint
    if (endpoint === 'complete') {
      // Handle a completed scenario or activity
      const { scenarioId, score } = await req.json();
      
      // Update user progress
      const { data, error } = await supabaseAdmin
        .from('user_progress')
        .update({ 
          completed: true,
          score: score,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('scenario_id', scenarioId)
        .select();
        
      if (error) throw error;
      
      // Award XP
      const xpGained = score * 10; // Example: 10 XP per point in score
      
      const { data: progressData, error: progressError } = await supabaseAdmin
        .from('agent_progress')
        .update({ 
          xp_points: supabase.rpc('increment_xp', { user_id_param: user.id, xp_to_add: xpGained }),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select();
        
      if (progressError) throw progressError;
      
      responseData = { success: true, xpGained };
    }
    else if (endpoint === 'performance') {
      // Get agent performance metrics
      responseData = await getAgentPerformance(supabaseAdmin, user.id);
    }
    else if (endpoint === 'achievements') {
      // Get user achievements
      responseData = await getUserAchievements(supabaseAdmin, user.id);
    } 
    else {
      // Default: return all dashboard data
      const progressData = await getAgentProgress(supabaseAdmin, user.id);
      const levelData = calculateLevel(progressData.xp_points);
      const achievements = await getUserAchievements(supabaseAdmin, user.id);
      const scenarios = await getUserScenarios(supabaseAdmin, user.id);
      const performance = await getAgentPerformance(supabaseAdmin, user.id);
      const recommendations = await getRecommendations(supabaseAdmin, user.id);
      
      responseData = {
        progress: {
          level: levelData.level,
          currentXp: levelData.currentXp,
          requiredXp: levelData.requiredXp,
          totalXp: levelData.totalXp,
          streak: progressData.current_streak,
          nextReward: "500 XP"
        },
        stats: {
          scenariosCompleted: scenarios.completedScenarios.length,
          badgesEarned: achievements.length,
          avgRating: performance.customer_satisfaction / 20 // Convert to 0-5 scale
        },
        achievements,
        scenarios: {
          completed: scenarios.completedScenarios,
          inProgress: scenarios.inProgressScenarios
        },
        performance,
        recommendations
      };
    }
    
    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error processing dashboard data request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: error.message === 'Unauthorized' ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
