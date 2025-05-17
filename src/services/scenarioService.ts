
import { supabase } from '@/integrations/supabase/client';

export type Scenario = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  is_premium: boolean | null;
};

export const fetchScenarios = async (): Promise<Scenario[]> => {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*');
  
  if (error) {
    console.error("Error fetching scenarios:", error);
    throw error;
  }
  
  return data || [];
};

export const fetchScenarioById = async (id: string): Promise<Scenario> => {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching scenario with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const updateUserProgress = async (
  userId: string,
  scenarioId: string,
  score?: number,
  completed?: boolean,
  feedback?: string
) => {
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      scenario_id: scenarioId,
      score,
      completed,
      feedback
    }, {
      onConflict: 'user_id,scenario_id'
    });
    
  if (error) {
    console.error("Error updating user progress:", error);
    throw error;
  }
};

export const fetchUserProgress = async (userId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      scenarios:scenario_id(*)
    `)
    .eq('user_id', userId);
  
  if (error) {
    console.error("Error fetching user progress:", error);
    throw error;
  }
  
  return data || [];
};
