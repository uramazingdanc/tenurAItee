
import { supabase } from '@/integrations/supabase/client';

export type KnowledgeItem = {
  id: string;
  title: string;
  content: string;
  category: string;
  is_premium: boolean | null;
};

export const fetchKnowledgeItems = async (): Promise<KnowledgeItem[]> => {
  const { data, error } = await supabase
    .from('knowledge_items')
    .select('*');
  
  if (error) {
    console.error("Error fetching knowledge items:", error);
    throw error;
  }
  
  return data || [];
};

export const fetchKnowledgeItemsByCategory = async (category: string): Promise<KnowledgeItem[]> => {
  const { data, error } = await supabase
    .from('knowledge_items')
    .select('*')
    .eq('category', category);
  
  if (error) {
    console.error(`Error fetching knowledge items for category ${category}:`, error);
    throw error;
  }
  
  return data || [];
};
