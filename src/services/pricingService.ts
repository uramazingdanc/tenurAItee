
import { supabase } from '@/integrations/supabase/client';

export type PricingPlan = {
  id: string;
  name: string;
  price: number | null;
  is_custom: boolean;
  description: string;
  features: string[];
  most_popular: boolean;
};

export const fetchPricingPlans = async (): Promise<PricingPlan[]> => {
  const { data, error } = await supabase
    .from('pricing_plans')
    .select('*')
    .order('price', { ascending: true });
    
  if (error) {
    console.error("Error fetching pricing plans:", error);
    throw error;
  }
  
  return data || [];
};

export const fetchPlanFeatures = async (planId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('plan_features')
    .select('feature')
    .eq('plan_id', planId);
    
  if (error) {
    console.error(`Error fetching features for plan ${planId}:`, error);
    throw error;
  }
  
  return data ? data.map(item => item.feature) : [];
};

export const fetchFAQs = async (): Promise<{ question: string; answer: string }[]> => {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('category', 'pricing');
    
  if (error) {
    console.error("Error fetching pricing FAQs:", error);
    throw error;
  }
  
  return data || [];
};
