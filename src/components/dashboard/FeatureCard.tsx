
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkTo: string;
  iconColor?: string;
  iconBgColor?: string;
}

const FeatureCard = ({ icon: Icon, title, description, linkTo, iconColor = "text-brand-blue", iconBgColor = "bg-brand-blue/10" }: FeatureCardProps) => {
  return (
    <Link to={linkTo}>
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-brand-blue/40">
        <CardHeader className="pb-2">
          <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center mb-4`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm text-gray-500">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 text-sm">
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeatureCard;
