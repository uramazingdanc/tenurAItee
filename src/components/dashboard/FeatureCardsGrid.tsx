
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
      description: "Access our comprehensive knowledge base to learn best practices",
      linkTo: "/knowledge",
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
      apiEndpoint: "/training/rag",
      isLocked: false
    },
    {
      icon: Phone,
      title: "Mock Call Scenarios",
      description: "Practice handling customer inquiries with interactive simulations",
      linkTo: "/scenarios",
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      apiEndpoint: "/simulator/start",
      isLocked: false
    },
    {
      icon: Play,
      title: "Video Learning Hub",
      description: "Learn from watching experienced agents handle calls",
      linkTo: "/videos",
      iconColor: "text-indigo-600",
      iconBgColor: "bg-indigo-100",
      apiEndpoint: "/media/videos",
      isLocked: false
    },
    {
      icon: MessageSquare,
      title: "Tenured AI Assistant",
      description: "Get real-time feedback during guided call simulations",
      linkTo: "/chat-simulation",
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100",
      apiEndpoint: "/user/current_scenario",
      isLocked: user?.id ? false : true, // Lock for non-authenticated users
      requiredPrerequisites: ["Basic Training"] 
    }
  ];

  // Map backend features to the format expected by FeatureCard if available
  const displayFeatures = features?.length 
    ? features.map(f => {
        // Map icons based on feature name
        const getIcon = (name) => {
          if (name.toLowerCase().includes('knowledge') || name.toLowerCase().includes('rag')) return FileText;
          if (name.toLowerCase().includes('call') || name.toLowerCase().includes('scenario')) return Phone;
          if (name.toLowerCase().includes('video')) return Play;
          if (name.toLowerCase().includes('assistant') || name.toLowerCase().includes('chat') || 
              name.toLowerCase().includes('guide')) return MessageSquare;
          return FileText; // Default
        };
        
        return {
          icon: getIcon(f.name),
          title: f.name,
          description: f.description,
          linkTo: f.linkTo || "/dashboard",
          iconColor: f.iconColor || "text-blue-600",
          iconBgColor: f.iconBgColor || "bg-blue-100",
          apiEndpoint: f.apiEndpoint,
          isLocked: f.isLocked || false,
          requiredPrerequisites: f.requiredPrerequisites || []
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
            isLocked={feature.isLocked}
            requiredPrerequisites={feature.requiredPrerequisites}
            apiEndpoint={feature.apiEndpoint}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureCardsGrid;
