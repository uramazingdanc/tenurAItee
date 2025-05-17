
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkTo?: string;
  iconColor?: string;
  iconBgColor?: string;
  isLocked?: boolean;
  requiredPrerequisites?: string[];
  apiEndpoint?: string;
  onClick?: () => void;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  iconColor = "text-brand-blue", 
  iconBgColor = "bg-brand-blue/10",
  isLocked = false,
  requiredPrerequisites = [],
  onClick
}: FeatureCardProps) => {

  return (
    <div 
      onClick={onClick}
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
