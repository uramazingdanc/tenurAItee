import { supabase } from '@/integrations/supabase/client';

// Types for dashboard data
export interface TrainingFeature {
  id: string;
  name: string;
  description: string;
  iconColor?: string;
  iconBgColor?: string;
  linkTo?: string;
  is_premium?: boolean;
  apiEndpoint?: string;
  isLocked?: boolean;
  requiredPrerequisites?: string[];
}

export interface AgentPerformance {
  response_accuracy: number;
  issue_resolution_rate: number;
  customer_satisfaction: number;
  improvement_areas: { title: string; value: number }[];
  period_start: string;
  period_end: string;
}

export interface UserProgress {
  xp_points: number;
  current_level: number;
  current_streak: number;
  last_activity_date: string;
}

export interface DashboardData {
  profile: any;
  progress: UserProgress;
  performance: AgentPerformance;
  completedScenarios: any[];
  achievements: Achievement[];
  recommendations: Recommendation[];
  learningPath: any[];
}

// Type definitions for components
export interface AgentProgressData {
  level: number;
  currentXp: number;
  requiredXp: number;
  streak: number;
  nextReward: string;
  xp_points?: number; // Add this property to match what DashboardSidebar is using
}

export interface Recommendation {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'article' | 'practice';
  duration: string;
  url?: string;
}

export interface Achievement {
  id?: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  index?: number;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completion?: number;
  status?: 'completed' | 'in-progress' | 'locked';
  category?: string;
}

// Fetch dashboard data from Supabase Edge Function
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const { data, error } = await supabase.functions.invoke('dashboard-data', {
      // No body needed, will use JWT from supabase client
    });

    if (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    // Return default data for graceful degradation
    return {
      profile: null,
      progress: {
        xp_points: 0,
        current_level: 1,
        current_streak: 0,
        last_activity_date: new Date().toISOString()
      },
      performance: {
        response_accuracy: 0,
        issue_resolution_rate: 0,
        customer_satisfaction: 0,
        improvement_areas: [],
        period_start: new Date().toISOString(),
        period_end: new Date().toISOString()
      },
      completedScenarios: [],
      achievements: [],
      recommendations: [],
      learningPath: []
    };
  }
};

// Fetch training features from database
export const fetchTrainingFeatures = async (): Promise<TrainingFeature[]> => {
  try {
    // Try to fetch from backend first
    const { data: features, error } = await supabase
      .from('features')
      .select('*')
      .eq('is_premium', false);

    if (error) {
      console.error('Error fetching training features:', error);
      throw error;
    }

    // Map database features to include UI properties
    return features.map(feature => ({
      ...feature,
      iconColor: getIconColor(feature.name),
      iconBgColor: getIconBgColor(feature.name),
      linkTo: getLinkForFeature(feature.name),
      apiEndpoint: getApiEndpointForFeature(feature.name),
      isLocked: false, // Default to unlocked
      requiredPrerequisites: [] // Default to no prerequisites
    }));
  } catch (error) {
    console.error('Failed to fetch training features:', error);
    return [];
  }
};

// Helper functions for UI properties
const getIconColor = (featureName: string): string => {
  const name = featureName.toLowerCase();
  if (name.includes('knowledge')) return 'text-blue-600';
  if (name.includes('call')) return 'text-green-600';
  if (name.includes('video')) return 'text-purple-600';
  if (name.includes('assistant')) return 'text-orange-600';
  return 'text-blue-600';
};

const getIconBgColor = (featureName: string): string => {
  const name = featureName.toLowerCase();
  if (name.includes('knowledge')) return 'bg-blue-100';
  if (name.includes('call')) return 'bg-green-100';
  if (name.includes('video')) return 'bg-purple-100';
  if (name.includes('assistant')) return 'bg-orange-100';
  return 'bg-blue-100';
};

const getLinkForFeature = (featureName: string): string => {
  const name = featureName.toLowerCase();
  if (name.includes('knowledge')) return '/knowledge';
  if (name.includes('call')) return '/dashboard#simulation';
  if (name.includes('video')) return '/videos';
  if (name.includes('assistant')) return '/dashboard#chat';
  return '/dashboard';
};

// New helper function for API endpoints
const getApiEndpointForFeature = (featureName: string): string | undefined => {
  const name = featureName.toLowerCase();
  if (name.includes('knowledge') || name.includes('rag')) return '/training/rag';
  if (name.includes('call')) return '/simulator/start';
  if (name.includes('video')) return '/media/videos';
  if (name.includes('assistant') || name.includes('chat')) return '/user/current_scenario';
  return undefined;
};

// Update agent progress
export const updateAgentProgress = async (
  progressUpdate: Partial<UserProgress>
): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    
    if (!user.data?.user) {
      throw new Error('No authenticated user found');
    }
    
    const { error } = await supabase
      .from('agent_progress')
      .update(progressUpdate)
      .eq('user_id', user.data.user.id);

    if (error) {
      console.error('Error updating agent progress:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to update agent progress:', error);
  }
};
