
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkTo: string;
  iconColor?: string;
  iconBgColor?: string;
  isLocked?: boolean;
  requiredPrerequisites?: string[];
  apiEndpoint?: string;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  linkTo, 
  iconColor = "text-brand-blue", 
  iconBgColor = "bg-brand-blue/10",
  isLocked = false,
  requiredPrerequisites = [],
  apiEndpoint
}: FeatureCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast.warning("Complete prerequisites first", {
        description: `You need to complete ${requiredPrerequisites.join(", ")} to unlock this feature.`,
      });
      return;
    }

    // Log the action for analytics (simplified version)
    console.log(`User clicked on feature: ${title}`);

    // Simulate loading state for API-dependent features
    if (apiEndpoint) {
      toast.info(`Loading ${title}...`, {
        description: "Preparing your personalized content"
      });
      
      // In a real implementation, we would make the API call here
      // For now, just navigate after a short delay to simulate loading
      setTimeout(() => {
        navigate(linkTo);
      }, 800);
      return;
    }

    navigate(linkTo);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`cursor-pointer ${isLocked ? "opacity-70" : ""}`}
    >
      <Card className={`h-full transition-all duration-200 hover:shadow-md ${isLocked ? "border-gray-300" : "hover:border-brand-blue/40"}`}>
        <CardHeader className="pb-2">
          <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center mb-4`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <CardTitle className="text-lg font-semibold">
            {title}
            {isLocked && (
              <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">Locked</span>
            )}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 text-sm">
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureCard;
