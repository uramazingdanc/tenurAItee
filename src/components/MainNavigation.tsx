
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchFeatures } from "@/services/tierService";

const MainNavigation = () => {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: features = [] } = useQuery({
    queryKey: ['features', !!user],
    queryFn: () => fetchFeatures(!!user),
    enabled: isMounted,
  });

  const freeTierFeatures = features.filter(feature => !feature.is_premium);
  const premiumTierFeatures = features.filter(feature => feature.is_premium);

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className={navigationMenuTriggerStyle()}>
            Home
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-2 gap-3 p-4 md:w-[600px] lg:w-[700px]">
              <div className="space-y-3">
                <h4 className="font-medium leading-none text-brand-blue">🟦 Free Tier</h4>
                <ul className="space-y-2">
                  {freeTierFeatures.map((feature) => (
                    <li key={feature.id} className="flex items-center">
                      <span
                        className="mr-2"
                        dangerouslySetInnerHTML={{ __html: feature.icon }}
                      />
                      <span>{feature.name} - {feature.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium leading-none text-brand-blue">🟨 Paid Tier</h4>
                <ul className="space-y-2">
                  {premiumTierFeatures.map((feature) => (
                    <li key={feature.id} className="flex items-center">
                      <span
                        className="mr-2"
                        dangerouslySetInnerHTML={{ __html: feature.icon }}
                      />
                      <span>{feature.name} - {feature.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/pricing" className={navigationMenuTriggerStyle()}>
            Pricing
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/about" className={navigationMenuTriggerStyle()}>
            About
          </Link>
        </NavigationMenuItem>

        {user && (
          <>
            <NavigationMenuItem>
              <Link to="/dashboard" className={navigationMenuTriggerStyle()}>
                Dashboard
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/knowledge" className={navigationMenuTriggerStyle()}>
                Knowledge Base
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/videos" className={navigationMenuTriggerStyle()}>
                Videos
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/learning-path" className={navigationMenuTriggerStyle()}>
                Learning Path
              </Link>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
