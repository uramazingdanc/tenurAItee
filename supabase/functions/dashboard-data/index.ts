
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
    
    console.log("Fetching dashboard data for user:", user.id);

    // Fetch profile data
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      throw new Error('Failed to fetch profile data');
    }

    // Fetch user progress data
    const { data: progressData, error: progressError } = await supabaseAdmin
      .from('agent_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Fetch performance stats (for the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data: performanceData, error: performanceError } = await supabaseAdmin
      .from('agent_performance')
      .select('*')
      .eq('user_id', user.id)
      .gte('period_start', thirtyDaysAgo.toISOString())
      .order('period_start', { ascending: false })
      .limit(1)
      .single();

    // Fetch user's completed scenarios
    const { data: completedScenarios, error: scenariosError } = await supabaseAdmin
      .from('user_progress')
      .select(`
        *,
        scenarios:scenario_id(*)
      `)
      .eq('user_id', user.id)
      .eq('completed', true);

    // Fetch user's achievements
    const { data: achievements, error: achievementsError } = await supabaseAdmin
      .from('user_achievements')
      .select(`
        *,
        achievements:achievement_id(*)
      `)
      .eq('user_id', user.id);

    // Generate AI-powered recommendations based on performance and progress
    const recommendations = await generateRecommendations(
      user.id, 
      performanceData, 
      completedScenarios,
      supabaseAdmin
    );

    // Generate learning path
    const learningPath = await generateLearningPath(
      user.id,
      completedScenarios,
      supabaseAdmin
    );

    // Compile response data
    const dashboardData = {
      profile: profileData,
      progress: progressData || { 
        user_id: user.id,
        xp_points: 0,
        current_level: 1,
        current_streak: 0,
        last_activity_date: new Date().toISOString()
      },
      performance: performanceData || {
        user_id: user.id,
        response_accuracy: 0,
        issue_resolution_rate: 0,
        customer_satisfaction: 0,
        improvement_areas: []
      },
      completedScenarios: completedScenarios || [],
      achievements: achievements || [],
      recommendations,
      learningPath
    };

    return new Response(
      JSON.stringify(dashboardData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error processing dashboard request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: error.message === 'Unauthorized' ? 401 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Generate AI-powered recommendations based on user's performance and completed scenarios
async function generateRecommendations(
  userId: string,
  performanceData: any,
  completedScenarios: any[],
  supabase: any
) {
  // Get low performance areas
  const weakAreas = [];
  if (performanceData) {
    if (performanceData.response_accuracy < 70) weakAreas.push('response_accuracy');
    if (performanceData.issue_resolution_rate < 70) weakAreas.push('issue_resolution_rate');
    if (performanceData.customer_satisfaction < 70) weakAreas.push('customer_satisfaction');
  }
  
  // Get scenarios the user hasn't completed yet, focusing on areas needing improvement
  const { data: recommendedScenarios } = await supabase
    .from('scenarios')
    .select('*')
    .limit(5);
  
  // Filter out completed scenarios
  const completedIds = new Set(completedScenarios?.map(item => item.scenario_id) || []);
  const filteredRecommendations = recommendedScenarios?.filter(
    scenario => !completedIds.has(scenario.id)
  ) || [];

  // Prioritize scenarios based on weak areas
  let prioritizedRecommendations = [...filteredRecommendations];
  if (weakAreas.length > 0) {
    // Simple prioritization logic - in a real app, this would be more sophisticated
    prioritizedRecommendations.sort((a, b) => {
      // Prioritize scenarios that match weak areas in category
      const aMatchesWeakArea = weakAreas.some(area => a.category.toLowerCase().includes(area));
      const bMatchesWeakArea = weakAreas.some(area => b.category.toLowerCase().includes(area));
      
      if (aMatchesWeakArea && !bMatchesWeakArea) return -1;
      if (!aMatchesWeakArea && bMatchesWeakArea) return 1;
      return 0;
    });
  }
  
  return prioritizedRecommendations.slice(0, 3).map(scenario => ({
    id: scenario.id,
    title: scenario.title,
    description: scenario.description,
    category: scenario.category,
    difficulty: scenario.difficulty
  }));
}

// Generate a personalized learning path based on completed scenarios and available content
async function generateLearningPath(
  userId: string,
  completedScenarios: any[],
  supabase: any
) {
  // Get all scenarios ordered by difficulty
  const { data: allScenarios } = await supabase
    .from('scenarios')
    .select('*')
    .order('difficulty', { ascending: true });
  
  // Calculate user level based on completed scenarios
  const userLevel = Math.max(1, Math.floor((completedScenarios?.length || 0) / 3) + 1);
  
  // Filter out completed scenarios
  const completedIds = new Set(completedScenarios?.map(item => item.scenario_id) || []);
  const availableScenarios = allScenarios?.filter(
    scenario => !completedIds.has(scenario.id)
  ) || [];
  
  // Group scenarios by difficulty level
  const groupedScenarios: Record<string, any[]> = {};
  availableScenarios.forEach(scenario => {
    if (!groupedScenarios[scenario.difficulty]) {
      groupedScenarios[scenario.difficulty] = [];
    }
    groupedScenarios[scenario.difficulty].push(scenario);
  });
  
  // Create learning path steps
  const learningPath = [];
  
  // Current level scenarios
  const currentLevelName = `Level ${userLevel}`;
  const currentLevelScenarios = groupedScenarios[userLevel.toString()] || 
                               groupedScenarios['beginner'] ||
                               [];
  
  if (currentLevelScenarios.length > 0) {
    learningPath.push({
      name: currentLevelName,
      description: `Complete these scenarios to advance to the next level`,
      scenarios: currentLevelScenarios.slice(0, 3).map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        category: s.category
      }))
    });
  }
  
  // Next level scenarios
  const nextLevelName = `Level ${userLevel + 1}`;
  const nextLevelScenarios = groupedScenarios[(userLevel + 1).toString()] || 
                            groupedScenarios['intermediate'] ||
                            [];
  
  if (nextLevelScenarios.length > 0) {
    learningPath.push({
      name: nextLevelName,
      description: `These scenarios will be unlocked when you reach ${nextLevelName}`,
      scenarios: nextLevelScenarios.slice(0, 3).map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        category: s.category
      }))
    });
  }
  
  // Add advanced scenarios if there's room
  if (learningPath.length < 3) {
    const advancedScenarios = groupedScenarios['advanced'] || [];
    if (advancedScenarios.length > 0) {
      learningPath.push({
        name: "Advanced Training",
        description: "Master these complex scenarios to become an expert",
        scenarios: advancedScenarios.slice(0, 3).map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
          category: s.category
        }))
      });
    }
  }
  
  return learningPath;
}
