
import React from "react";
import FeatureCard from "./FeatureCard";
import { FileText, Phone, Play, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrainingFeatures } from "@/services/dashboardService";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const FeatureCardsGrid = () => {
  const { user } = useAuth();
  const { data: features, isLoading } = useQuery({
    queryKey: ['trainingFeatures', user?.id],
    queryFn: fetchTrainingFeatures,
    enabled: !!user,
  });

  // Default features if not loaded from backend
  const defaultFeatures = [
    {
      icon: FileText,
      title: "RAG-Powered Knowledge Base",
      description: "Access comprehensive knowledge base powered by Retrieval Augmented Generation to learn best practices for customer service.",
      linkTo: "/knowledge",
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100"
    },
    {
      icon: Phone,
      title: "Mock Call Scenarios",
      description: "Practice handling customer inquiries through interactive simulations with ElevenLabs voice synthesis technology.",
      linkTo: "/dashboard#simulation",
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100"
    },
    {
      icon: Play,
      title: "Video Learning Hub",
      description: "Learn from watching recorded calls of tenured agents handling different customer service scenarios.",
      linkTo: "/videos",
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100"
    },
    {
      icon: MessageSquare,
      title: "Tenured AI Assistant",
      description: "Experience guided simulations with our AI assistant that provides real-time feedback and suggestions.",
      linkTo: "/dashboard#chat",
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-100"
    }
  ];

  // Map backend features to the format expected by FeatureCard if available
  const displayFeatures = features?.length 
    ? features.map(f => {
        // Map icons based on feature name
        const getIcon = (name) => {
          if (name.toLowerCase().includes('knowledge')) return FileText;
          if (name.toLowerCase().includes('call') || name.toLowerCase().includes('scenario')) return Phone;
          if (name.toLowerCase().includes('video')) return Play;
          if (name.toLowerCase().includes('assistant') || name.toLowerCase().includes('chat')) return MessageSquare;
          return FileText; // Default
        };
        
        return {
          icon: getIcon(f.name),
          title: f.name,
          description: f.description,
          linkTo: f.linkTo || "/dashboard",
          iconColor: f.iconColor || "text-blue-600",
          iconBgColor: f.iconBgColor || "bg-blue-100"
        };
      })
    : defaultFeatures;

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
      <h2 className="text-xl font-semibold mb-4">Training Resources</h2>
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
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureCardsGrid;
