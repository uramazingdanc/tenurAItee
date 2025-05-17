
import { supabase } from '@/integrations/supabase/client';

export type Tier = {
  id: string;
  name: string;
  description: string;
  is_free: boolean;
};

export type Feature = {
  id: string;
  name: string;
  description: string;
  tier_id: string;
  icon: string;
  is_premium: boolean;
};

export const fetchTiers = async (): Promise<Tier[]> => {
  const { data, error } = await supabase
    .from('tiers')
    .select('*')
    .order('is_free', { ascending: false });
    
  if (error) {
    console.error("Error fetching tiers:", error);
    throw error;
  }
  
  return data || [];
};

export const fetchFeatures = async (includePremium: boolean = false): Promise<Feature[]> => {
  const query = supabase
    .from('features')
    .select('*');
    
  if (!includePremium) {
    query.eq('is_premium', false);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching features:", error);
    throw error;
  }
  
  return data || [];
};

export const fetchFeaturesByTier = async (tierId: string, includePremium: boolean = false): Promise<Feature[]> => {
  const query = supabase
    .from('features')
    .select('*')
    .eq('tier_id', tierId);
    
  if (!includePremium) {
    query.eq('is_premium', false);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error fetching features for tier ${tierId}:`, error);
    throw error;
  }
  
  return data || [];
};
