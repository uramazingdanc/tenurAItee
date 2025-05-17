
import { supabase } from '@/integrations/supabase/client';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string | null;
};

export type Partner = {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  category: string;
};

export const fetchAboutInfo = async (): Promise<{
  mission: string;
  vision: string;
  story: string;
}> => {
  const { data, error } = await supabase
    .from('about')
    .select('*')
    .single();
    
  if (error) {
    console.error("Error fetching about info:", error);
    throw error;
  }
  
  return data || { mission: '', vision: '', story: '' };
};

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('name');
    
  if (error) {
    console.error("Error fetching team members:", error);
    throw error;
  }
  
  return data || [];
};

export const fetchPartners = async (category?: 'trusted_by' | 'backed_by' | 'other'): Promise<Partner[]> => {
  const query = supabase
    .from('partners')
    .select('*');
    
  if (category) {
    query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching partners:", error);
    throw error;
  }
  
  return data || [];
};
