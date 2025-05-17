
import React from "react";
import FeatureCard from "./FeatureCard";
import { BookOpen, Phone, Play, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrainingFeatures } from "@/services/dashboardService";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const TrainingFeaturesGrid = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: features, isLoading } = useQuery({
    queryKey: ['trainingFeatures', user?.id],
    queryFn: fetchTrainingFeatures,
    enabled: !!user,
  });

  // Training features definition
  const trainingFeatures = [
    {
      icon: BookOpen,
      title: "RAG-Powered Knowledge Base",
      description: "Access a comprehensive knowledge base powered by Retrieval Augmented Generation",
      linkTo: "/knowledge",
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
      apiEndpoint: "/api/knowledge",
      isLocked: false
    },
    {
      icon: Phone,
      title: "Mock Call Simulator",
      description: "Practice handling customer inquiries through interactive simulations",
      linkTo: "/scenarios",
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      apiEndpoint: "/simulator/start",
      isLocked: false
    },
    {
      icon: Play,
      title: "Video Learning Hub",
      description: "Learn from watching experienced agents handle various scenarios",
      linkTo: "/videos",
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100",
      apiEndpoint: "/media/videos",
      isLocked: false
    },
    {
      icon: MessageSquare,
      title: "Tenured AI Assistant",
      description: "Get real-time coaching and guidance from our AI assistant",
      linkTo: "/chat-simulation",
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-100",
      apiEndpoint: "/user/coach",
      isLocked: !user?.id,
      requiredPrerequisites: ["Basic Training"]
    }
  ];

  // Display features from backend if available, otherwise use default features
  const displayFeatures = features?.length ? features : trainingFeatures;

  const handleCardClick = (feature) => {
    if (feature.isLocked) {
      toast.warning("Complete prerequisites first", {
        description: `You need to complete ${feature.requiredPrerequisites?.join(", ") || "required training"} to unlock this feature.`
      });
      return;
    }

    if (feature.apiEndpoint && feature.apiEndpoint !== "/api/knowledge") {
      toast.info(`Loading ${feature.title}...`, {
        description: "Preparing your personalized content"
      });
    }

    navigate(feature.linkTo);
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Training Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="mb-4"><Skeleton className="h-12 w-12 rounded-full" /></div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Train Smarter with AI-Powered Tools</h2>
      <p className="text-gray-600 mb-6">
        Our platform offers a variety of features designed to enhance the skills of your customer service representatives.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayFeatures.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            linkTo={feature.linkTo}
            iconColor={feature.iconColor}
            iconBgColor={feature.iconBgColor}
            isLocked={feature.isLocked}
            requiredPrerequisites={feature.requiredPrerequisites}
            apiEndpoint={feature.apiEndpoint}
            onClick={() => handleCardClick(feature)}
          />
        ))}
      </div>
    </div>
  );
};

export default TrainingFeaturesGrid;
