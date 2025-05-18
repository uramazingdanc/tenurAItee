
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchVideos, trackVideoView, fetchRecommendedVideos } from "@/services/videoService";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Play, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import type { Video } from "@/services/videoService";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const isAuthenticated = !!user;
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  // Use react-query to fetch and cache video data
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos', isAuthenticated],
    queryFn: () => fetchVideos(isAuthenticated)
  });
  
  // Fetch recommended videos
  const { data: recommendedVideos } = useQuery({
    queryKey: ['recommendedVideos', isAuthenticated],
    queryFn: fetchRecommendedVideos,
    enabled: isAuthenticated
  });

  // Handle opening a video
  const handleOpenVideo = (video: Video) => {
    if (video.is_premium && !isAuthenticated) {
      toast({
        title: "Premium Content",
        description: "Please sign in to access premium content",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedVideo(video);
    setIsVideoOpen(true);
    
    // Track this video view
    if (isAuthenticated) {
      trackVideoView(video.id).catch(console.error);
    }
  };

  // Process videos data to include durations and ensure thumbnails
  const processedVideos = videos?.map(video => ({
    ...video,
    duration: calculateDuration(video),
    thumbnail_url: video.thumbnail_url || getDefaultThumbnail(video.category)
  }));

  // Fallback videos if there's an error or while loading
  const fallbackVideos: (Video & { duration: string })[] = [
    {
      id: "1",
      title: "Handling Flight Cancellations",
      description: "Watch how experienced agents handle flight cancellation requests with empathy and efficiency.",
      video_url: "https://example.com/videos/1.mp4",
      thumbnail_url: "https://via.placeholder.com/320x180/3B82F6/FFFFFF?text=Flight+Cancellations",
      category: "Customer Service",
      is_premium: false,
      duration: "8:24"
    },
    {
      id: "2",
      title: "Resolving Booking Disputes",
      description: "Learn techniques for addressing customer disputes regarding bookings and charges.",
      video_url: "https://example.com/videos/2.mp4",
      thumbnail_url: "https://via.placeholder.com/320x180/22C55E/FFFFFF?text=Booking+Disputes",
      category: "Conflict Resolution",
      is_premium: false,
      duration: "10:12"
    },
    {
      id: "3",
      title: "Upselling Travel Insurance",
      description: "See how top agents naturally introduce and explain the benefits of travel insurance.",
      video_url: "https://example.com/videos/3.mp4",
      thumbnail_url: "https://via.placeholder.com/320x180/8B5CF6/FFFFFF?text=Travel+Insurance",
      category: "Sales",
      is_premium: true,
      duration: "6:45"
    },
    {
      id: "4",
      title: "Handling Difficult Customers",
      description: "Expert strategies for turning negative customer experiences into positive outcomes.",
      video_url: "https://example.com/videos/4.mp4",
      thumbnail_url: "https://via.placeholder.com/320x180/EF4444/FFFFFF?text=Difficult+Customers",
      category: "Customer Service",
      is_premium: false,
      duration: "12:33"
    }
  ];

  // Videos to display - either from Supabase or fallbacks
  const displayVideos = processedVideos || fallbackVideos;

  return (
    <section className="py-8 bg-white" id="videos">
      <div className="container mx-auto px-4">
        {!isLoading && recommendedVideos && recommendedVideos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedVideos.map((video) => (
                <VideoCard 
                  key={video.id} 
                  video={{
                    ...video,
                    duration: calculateDuration(video),
                    thumbnail_url: video.thumbnail_url || getDefaultThumbnail(video.category)
                  }} 
                  isAuthenticated={isAuthenticated}
                  onOpenVideo={handleOpenVideo}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">All Training Videos</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayVideos.map((video) => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  isAuthenticated={isAuthenticated}
                  onOpenVideo={handleOpenVideo}
                />
              ))}
            </div>
          )}
        </div>

        {videos && videos.length > 12 && (
          <div className="text-center mt-8">
            <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10">
              View All Videos
            </Button>
          </div>
        )}
      </div>

      {/* Video Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black relative flex items-center justify-center">
            {selectedVideo?.video_url ? (
              <video 
                src={selectedVideo.video_url} 
                controls 
                className="w-full h-full"
                autoPlay
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-white">
                <PlayCircle className="w-16 h-16 mb-4" />
                <p>Video preview not available</p>
              </div>
            )}
          </div>
          <p className="text-gray-700 mt-4">
            {selectedVideo?.description}
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
};

// Video card component to avoid repetition
const VideoCard = ({ video, isAuthenticated, onOpenVideo }: { 
  video: Video & { duration: string, thumbnail_url: string }, 
  isAuthenticated: boolean,
  onOpenVideo: (video: Video) => void
}) => {
  return (
    <div className="group">
      <Card className="overflow-hidden card-hover">
        <div className="relative">
          <img 
            src={video.thumbnail_url} 
            alt={video.title} 
            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {video.is_premium && !isAuthenticated ? (
              <Button 
                className="bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center"
                asChild
              >
                <Link to="/login">
                  <Lock className="h-6 w-6 text-white" />
                </Link>
              </Button>
            ) : (
              <Button 
                className="bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center"
                onClick={() => onOpenVideo(video)}
              >
                <Play className="h-6 w-6 text-white" />
              </Button>
            )}
          </div>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
          {video.is_premium && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              Premium
            </div>
          )}
        </div>
        <CardContent className="pt-4">
          <h3 className="font-medium text-lg mb-2">{video.title}</h3>
          <p className="text-gray-500 text-sm">{video.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoHub;
