
import { supabase } from '@/integrations/supabase/client';

export type KnowledgeItem = {
  id: string;
  title: string;
  content: string;
  category: string;
  is_premium: boolean | null;
};

export const fetchKnowledgeItems = async (includePremium: boolean = false): Promise<KnowledgeItem[]> => {
  const query = supabase
    .from('knowledge_items')
    .select('*');
    
  // If we don't want premium content, explicitly filter it out
  if (!includePremium) {
    query.eq('is_premium', false);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching knowledge items:", error);
    throw error;
  }
  
  return data || [];
};

export const fetchKnowledgeItemsByCategory = async (category: string, includePremium: boolean = false): Promise<KnowledgeItem[]> => {
  const query = supabase
    .from('knowledge_items')
    .select('*')
    .eq('category', category);
    
  // If we don't want premium content, explicitly filter it out
  if (!includePremium) {
    query.eq('is_premium', false);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error fetching knowledge items for category ${category}:`, error);
    throw error;
  }
  
  return data || [];
};

export const fetchPremiumKnowledgeItems = async (): Promise<KnowledgeItem[]> => {
  const { data, error } = await supabase
    .from('knowledge_items')
    .select('*')
    .eq('is_premium', true);
    
  if (error) {
    console.error("Error fetching premium knowledge items:", error);
    throw error;
  }
  
  return data || [];
};
