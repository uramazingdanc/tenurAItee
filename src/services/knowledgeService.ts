
import { supabase } from '@/integrations/supabase/client';

export type KnowledgeItem = {
  id: string;
  title: string;
  content: string;
  category: string;
  is_premium: boolean | null;
};

export type KnowledgeCategory = {
  id: string;
  name: string;
  description: string;
  icon: any;
  quizExample?: string;
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

// We'll use hardcoded categories since the table doesn't exist yet
export const fetchKnowledgeCategories = async (): Promise<KnowledgeCategory[]> => {
  // Instead of querying a non-existent table, we'll return our predefined categories
  const categories: KnowledgeCategory[] = [
    {
      id: 'handling_calls',
      name: 'Handling Calls',
      description: 'De-escalation scripts, tone guidelines, call flowcharts',
      icon: 'Phone',
      quizExample: 'Which phrase best demonstrates active listening?'
    },
    {
      id: 'process_bookings',
      name: 'Process Bookings',
      description: 'Step-by-step booking workflow, common errors, verification protocols',
      icon: 'FileText',
      quizExample: 'Identify the 3 mandatory fields for new bookings'
    },
    {
      id: 'modify_bookings',
      name: 'Modify Bookings',
      description: 'Policy exceptions, fee structures, system navigation screenshots',
      icon: 'FileText',
      quizExample: 'Calculate change fees for a date modification 48hrs pre-departure'
    },
    {
      id: 'cancel_bookings',
      name: 'Cancel Bookings',
      description: 'Refund eligibility tables, cancellation scripts, retention strategies',
      icon: 'Ban',
      quizExample: 'Which cancellation reason qualifies for full refund under DOT regulations?'
    },
    {
      id: 'refund_requests',
      name: 'Refund Requests',
      description: 'Dispute resolution paths, documentation requirements, approval workflow',
      icon: 'CreditCard',
      quizExample: 'Match each refund type to its processing timeline'
    }
  ];
  
  return categories;
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
