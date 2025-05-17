
import { supabase } from '@/integrations/supabase/client';

export type Video = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  is_premium: boolean | null;
  tags?: string[];
};

export const fetchVideos = async (includePremium: boolean = false): Promise<Video[]> => {
  const query = supabase
    .from('videos')
    .select('*');
    
  // If we don't want premium content, explicitly filter it out
  // Note: RLS will handle restricting premium content if the user is not authenticated
  if (!includePremium) {
    query.eq('is_premium', false);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
  
  return data || [];
};

export const fetchVideoById = async (id: string): Promise<Video> => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching video with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const fetchPremiumVideos = async (): Promise<Video[]> => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('is_premium', true);
    
  if (error) {
    console.error("Error fetching premium videos:", error);
    throw error;
  }
  
  return data || [];
};

export const fetchVideosByCategory = async (category: string, includePremium: boolean = false): Promise<Video[]> => {
  const query = supabase
    .from('videos')
    .select('*')
    .eq('category', category);
    
  if (!includePremium) {
    query.eq('is_premium', false);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error fetching videos for category ${category}:`, error);
    throw error;
  }
  
  return data || [];
};

export const fetchVideoTags = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('video_tags')
    .select('tag');
    
  if (error) {
    console.error("Error fetching video tags:", error);
    throw error;
  }
  
  return data ? data.map(item => item.tag) : [];
};
