
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AIChatWidget from "@/components/AIChatWidget";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { motion } from "@/components/ui/motion";
import { toast } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/services/dashboardService";
import DashboardContent from "./DashboardContent";
import DashboardLoading from "./DashboardLoading";
import DashboardError from "./DashboardError";

const DashboardLayout = () => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { user } = useAuth();

  // Use React Query for data fetching
  const { data: dashboardData, error: dashboardError, isLoading } = useQuery({
    queryKey: ['dashboardData', user?.id],
    queryFn: fetchDashboardData,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Demo effect to show a welcome toast
  useState(() => {
    if (user?.id) {
      const hasSeenWelcome = sessionStorage.getItem('welcomed');
      if (!hasSeenWelcome) {
        setTimeout(() => {
          toast.success("Welcome back to your training dashboard!", {
            description: "You have new recommended scenarios to explore.",
            action: {
              label: "View",
              onClick: () => document.getElementById("scenarios-tab")?.click()
            }
          });
          sessionStorage.setItem('welcomed', 'true');
        }, 1500);
      }
    }
  });

  // Display loading state
  if (isLoading) {
    return <DashboardLoading />;
  }

  // Display error state
  if (dashboardError || !dashboardData) {
    return <DashboardError error={dashboardError} />;
  }

  // Mock stats data since it's not in the actual data structure
  const userStats = {
    scenariosCompleted: dashboardData.completedScenarios?.length || 0,
    badgesEarned: dashboardData.achievements?.length || 0,
    avgRating: 4.8
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <motion.div 
        className="container mx-auto p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardHeader user={user} />
        
        <DashboardContent 
          dashboardData={dashboardData} 
          userStats={userStats}
        />
      </motion.div>
      
      {/* AI Chat Widget */}
      <AIChatWidget isOpen={isAIChatOpen} setIsOpen={setIsAIChatOpen} />
    </div>
  );
};

export default DashboardLayout;
