
import { supabase } from '@/integrations/supabase/client';

export type Video = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  is_premium: boolean | null;
};

export const fetchVideos = async (): Promise<Video[]> => {
  const { data, error } = await supabase
    .from('videos')
    .select('*');
  
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
