
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Get user from auth header
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get or create agent progress
    const { data: progressData, error: progressError } = await supabaseClient
      .from('agent_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    let progress;
    if (progressError) {
      // Create new agent progress if it doesn't exist
      const { data: newProgress, error: createError } = await supabaseClient
        .from('agent_progress')
        .insert({ user_id: user.id })
        .select()
        .single();
        
      if (createError) {
        throw createError;
      }
      progress = newProgress;
    } else {
      progress = progressData;
    }

    // Calculate required XP for next level (example formula)
    const requiredXp = progress.current_level * 1000;
    
    // Get user achievements
    const { data: userAchievements, error: achievementsError } = await supabaseClient
      .from('user_achievements')
      .select(`
        id,
        achievement: achievement_id (
          id,
          name, 
          description,
          icon,
          category
        )
      `)
      .eq('user_id', user.id);
      
    if (achievementsError) {
      throw achievementsError;
    }
    
    // Get all achievements to include ones user hasn't earned yet
    const { data: allAchievements, error: allAchievementsError } = await supabaseClient
      .from('achievements')
      .select('*');
      
    if (allAchievementsError) {
      throw allAchievementsError;
    }
    
    // Format achievements with unlocked status
    const achievements = allAchievements.map(achievement => {
      const userHasAchievement = userAchievements?.some(
        ua => ua.achievement.id === achievement.id
      );
      return {
        ...achievement,
        unlocked: userHasAchievement
      };
    });
    
    // Get user scenarios progress
    const { data: userScenarios, error: scenariosError } = await supabaseClient
      .from('user_progress')
      .select(`
        *,
        scenarios:scenario_id (*)
      `)
      .eq('user_id', user.id);
      
    if (scenariosError) {
      throw scenariosError;
    }
    
    // Get performance metrics
    const { data: performance, error: performanceError } = await supabaseClient
      .from('agent_performance')
      .select('*')
      .eq('user_id', user.id)
      .order('period_end', { ascending: false })
      .limit(1)
      .single();
      
    if (performanceError && performanceError.code !== 'PGRST116') { // ignore not found error
      throw performanceError;
    }
    
    // Format completed and in-progress scenarios
    const completedScenarios = userScenarios
      ?.filter(s => s.completed)
      .map(s => ({
        id: s.scenario_id,
        title: s.scenarios.title,
        description: s.scenarios.description,
        difficulty: s.scenarios.difficulty,
        category: s.scenarios.category,
        status: 'completed'
      })) || [];
      
    const inProgressScenarios = userScenarios
      ?.filter(s => !s.completed)
      .map(s => ({
        id: s.scenario_id,
        title: s.scenarios.title,
        description: s.scenarios.description,
        difficulty: s.scenarios.difficulty,
        category: s.scenarios.category,
        status: 'in-progress',
        completion: Math.floor(Math.random() * 100) // In a real app, this would be calculated
      })) || [];
    
    // Create recommendations based on performance
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
    
    // Build response object
    const dashboardData = {
      progress: {
        level: progress.current_level,
        currentXp: progress.xp_points,
        requiredXp: requiredXp,
        totalXp: progress.xp_points,
        streak: progress.current_streak,
        nextReward: `${100 * progress.current_level} XP` // Example reward calculation
      },
      stats: {
        scenariosCompleted: completedScenarios.length,
        badgesEarned: userAchievements?.length || 0,
        avgRating: performance?.customer_satisfaction ? performance.customer_satisfaction / 20 : 4.5 // Convert to 5 point scale or use default
      },
      achievements,
      scenarios: {
        completed: completedScenarios,
        inProgress: inProgressScenarios
      },
      performance: performance || {
        customer_satisfaction: 90,
        response_accuracy: 85,
        issue_resolution_rate: 75,
        improvement_areas: [
          { category: "skill", title: "Handling multiple requests at once" },
          { category: "knowledge", title: "Policy explanation clarity" }
        ],
        period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        period_end: new Date().toISOString()
      },
      recommendations
    };

    return new Response(
      JSON.stringify(dashboardData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
