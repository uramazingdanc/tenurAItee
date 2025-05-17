
import { supabase } from '@/integrations/supabase/client';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  earnedAt?: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  status?: "completed" | "in-progress" | "locked";
  completion?: number;
  score?: number;
  feedback?: string | null;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: "video" | "article" | "practice";
  url?: string;
  duration?: string;
}

export interface AgentPerformance {
  response_accuracy: number;
  issue_resolution_rate: number;
  customer_satisfaction: number;
  improvement_areas: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
}

export interface AgentProgressData {
  level: number;
  currentXp: number;
  requiredXp: number;
  streak: number;
  nextReward: string;
}

export interface DashboardData {
  profile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
  };
  progress: {
    xp_points: number;
    current_level: number;
    current_streak: number;
    last_activity_date: string;
  };
  performance: AgentPerformance;
  completedScenarios: Array<{
    id: string;
    scenario_id: string;
    score: number | null;
    completed: boolean;
    feedback: string | null;
    scenarios: {
      id: string;
      title: string;
      description: string;
      difficulty: string;
      category: string;
    };
  }>;
  achievements: Array<{
    id: string;
    achievement_id: string;
    earned_at: string;
    achievements: {
      id: string;
      name: string;
      description: string;
      icon: string;
      category: string;
    };
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    type: string;
    duration?: string;
  }>;
  learningPath: Array<{
    name: string;
    description: string;
    scenarios: Array<{
      id: string;
      title: string;
      description: string;
      category: string;
    }>;
  }>;
  stats: {
    scenariosCompleted: number;
    badgesEarned: number;
    avgRating: number;
  };
  scenarios: {
    completed: Scenario[];
    inProgress: Scenario[];
  };
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const { data, error } = await supabase.functions.invoke('dashboard-data');

    if (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
    
    return data as DashboardData;
  } catch (error) {
    console.error("Error in fetchDashboardData:", error);
    throw error;
  }
};

// Helper function to format dashboard data for components
export const formatDashboardStats = (dashboardData: DashboardData) => {
  // Format performance stats
  const performanceStats = [
    {
      name: 'Response Accuracy',
      value: dashboardData.performance?.response_accuracy || 0,
      description: 'How accurately you respond to customer inquiries',
      icon: 'CheckCircle'
    },
    {
      name: 'Issue Resolution',
      value: dashboardData.performance?.issue_resolution_rate || 0,
      description: 'Percentage of issues successfully resolved',
      icon: 'CircleCheck'
    },
    {
      name: 'Customer Satisfaction',
      value: dashboardData.performance?.customer_satisfaction || 0,
      description: 'Average customer satisfaction score',
      icon: 'Heart'
    }
  ];

  // Format progress data
  const progressData = {
    level: dashboardData.progress?.current_level || 1,
    xp: dashboardData.progress?.xp_points || 0,
    streak: dashboardData.progress?.current_streak || 0,
    lastActive: dashboardData.progress?.last_activity_date || new Date().toISOString()
  };

  // Format achievements
  const achievements = dashboardData.achievements?.map(item => ({
    id: item.achievements.id,
    name: item.achievements.name,
    description: item.achievements.description,
    icon: item.achievements.icon,
    category: item.achievements.category,
    unlocked: true,
    earnedAt: new Date(item.earned_at).toLocaleDateString()
  })) || [];

  // Format recommendations
  const recommendations = dashboardData.recommendations?.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    difficulty: item.difficulty,
    type: item.type || "practice",
    duration: item.duration
  })) || [];

  // Format learning path
  const learningPath = dashboardData.learningPath || [];

  // Format completed scenarios
  const completedScenarios = dashboardData.completedScenarios?.map(item => ({
    id: item.scenarios.id,
    title: item.scenarios.title,
    description: item.scenarios.description,
    difficulty: item.scenarios.difficulty,
    category: item.scenarios.category,
    score: item.score,
    feedback: item.feedback,
    status: "completed" as const
  })) || [];

  return {
    performanceStats,
    progressData,
    achievements,
    recommendations,
    learningPath,
    completedScenarios
  };
};
