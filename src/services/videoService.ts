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
  console.log(`Fetching videos, include premium: ${includePremium}`);
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

// Add a new function to track video views
export const trackVideoView = async (videoId: string, timeSpent?: number): Promise<void> => {
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // If not authenticated, just log it but don't throw an error
    console.log("User not authenticated, view not tracked");
    return;
  }
  
  const { error } = await supabase
    .from('video_views')
    .insert({
      user_id: user.id,
      video_id: videoId,
      time_spent: timeSpent || null
    });
  
  if (error) {
    console.error("Error tracking video view:", error);
    // Don't throw the error as this is non-critical functionality
  }
};

// Add function to fetch recommended videos based on user's viewing history
export const fetchRecommendedVideos = async (): Promise<Video[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Return popular videos if not authenticated
    return fetchPopularVideos();
  }
  
  // Here we would ideally query a recommendations endpoint or 
  // implement recommendation logic based on user's viewing history
  // For now, we'll just fetch all videos and sort by created_at
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);
  
  if (error) {
    console.error("Error fetching recommended videos:", error);
    return [];
  }
  
  return data || [];
};

// Add function to fetch popular videos
export const fetchPopularVideos = async (): Promise<Video[]> => {
  // In a real implementation, this would be based on view count
  // For now, just return all videos
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .limit(4);
  
  if (error) {
    console.error("Error fetching popular videos:", error);
    return [];
  }
  
  return data || [];
};
