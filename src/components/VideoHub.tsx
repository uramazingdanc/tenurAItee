
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Type definition for videos from Supabase
type Video = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  duration?: string; // This is not in the DB schema but used in the UI
  category: string;
  is_premium: boolean | null;
};

// Fetch videos from Supabase
const fetchVideos = async (): Promise<Video[]> => {
  const { data, error } = await supabase
    .from('videos')
    .select('*');
  
  if (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
  
  // Map the data to include a duration field
  return data.map(video => ({
    ...video,
    duration: calculateDuration(video), // Helper function to calculate video duration
    thumbnail_url: video.thumbnail_url || getDefaultThumbnail(video.category)
  }));
};

// Helper function to calculate video duration (mocked for now)
const calculateDuration = (video: Video): string => {
  // In a real app, this would use actual video duration
  // For now, we'll generate a random duration
  const minutes = Math.floor(Math.random() * 10) + 5;
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Helper function to get default thumbnail based on category
const getDefaultThumbnail = (category: string): string => {
  const categories: Record<string, string> = {
    "Best Practices": "https://via.placeholder.com/320x180/3B82F6/FFFFFF?text=Best+Practices",
    "Tutorials": "https://via.placeholder.com/320x180/22C55E/FFFFFF?text=Tutorials",
    "Advanced": "https://via.placeholder.com/320x180/8B5CF6/FFFFFF?text=Advanced",
    // Default fallback
    "default": "https://via.placeholder.com/320x180/EF4444/FFFFFF?text=Training+Video"
  };
  
  return categories[category] || categories.default;
};

const VideoHub = () => {
  // Use react-query to fetch and cache video data
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos
  });

  // Fallback videos if there's an error or while loading
  const fallbackVideos = [
    {
      id: "1",
      title: "Handling Flight Cancellations",
      duration: "8:24",
      thumbnail: "https://via.placeholder.com/320x180/3B82F6/FFFFFF?text=Flight+Cancellations",
      description: "Watch how experienced agents handle flight cancellation requests with empathy and efficiency."
    },
    {
      id: "2",
      title: "Resolving Booking Disputes",
      duration: "10:12",
      thumbnail: "https://via.placeholder.com/320x180/22C55E/FFFFFF?text=Booking+Disputes",
      description: "Learn techniques for addressing customer disputes regarding bookings and charges."
    },
    {
      id: "3",
      title: "Upselling Travel Insurance",
      duration: "6:45",
      thumbnail: "https://via.placeholder.com/320x180/8B5CF6/FFFFFF?text=Travel+Insurance",
      description: "See how top agents naturally introduce and explain the benefits of travel insurance."
    },
    {
      id: "4",
      title: "Handling Difficult Customers",
      duration: "12:33",
      thumbnail: "https://via.placeholder.com/320x180/EF4444/FFFFFF?text=Difficult+Customers",
      description: "Expert strategies for turning negative customer experiences into positive outcomes."
    }
  ];

  // If there's an error, log it but display fallback videos
  if (error) {
    console.error("Failed to load videos:", error);
  }

  // Videos to display - either from Supabase or fallbacks
  const displayVideos = videos || fallbackVideos;

  return (
    <section className="py-16 bg-white" id="videos">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-gradient">
            Video Learning Hub
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch recorded calls of tenured agents handling different customer service scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayVideos.map((video) => (
            <div key={video.id} className="group">
              <Card className="overflow-hidden card-hover">
                <div className="relative">
                  <img 
                    src={video.thumbnail_url || video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button className="bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 3L19 12L5 21V3Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-medium text-lg mb-2">{video.title}</h3>
                  <p className="text-gray-500 text-sm">{video.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10">
            View All Videos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoHub;
