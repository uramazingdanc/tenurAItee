
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
}

export interface UserPerformance {
  response_accuracy: number;
  issue_resolution_rate: number;
  customer_satisfaction: number;
  improvement_areas: string[];
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
  performance: UserPerformance;
  completedScenarios: any[];
  achievements: any[];
  recommendations: any[];
  learningPath: any[];
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
      linkTo: getLinkForFeature(feature.name)
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

// Update agent progress
export const updateAgentProgress = async (
  progressUpdate: Partial<UserProgress>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('agent_progress')
      .update(progressUpdate)
      .eq('user_id', supabase.auth.getUser());

    if (error) {
      console.error('Error updating agent progress:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to update agent progress:', error);
  }
};
