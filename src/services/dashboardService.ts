
import { supabase } from '@/integrations/supabase/client';

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
  performance: {
    response_accuracy: number;
    issue_resolution_rate: number;
    customer_satisfaction: number;
    improvement_areas: string[];
  };
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
    earnedAt: new Date(item.earned_at).toLocaleDateString()
  })) || [];

  // Format recommendations
  const recommendations = dashboardData.recommendations?.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    difficulty: item.difficulty
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
    feedback: item.feedback
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
