
import { useState, useEffect } from "react";
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

  // Use React Query for data fetching with proper error handling using meta
  const { data: dashboardData, error: dashboardError, isLoading, refetch } = useQuery({
    queryKey: ['dashboardData', user?.id],
    queryFn: fetchDashboardData,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error("Dashboard data fetch error in meta:", error);
      }
    }
  });
  
  // Set up separate effect for error handling
  useEffect(() => {
    if (dashboardError) {
      console.error("Dashboard data fetch error in effect:", dashboardError);
      toast.error("Failed to load dashboard data", {
        description: "Please try refreshing the page",
        action: {
          label: "Retry",
          onClick: () => refetch()
        }
      });
    }
  }, [dashboardError, refetch]);
  
  // Log data availability for debugging
  useEffect(() => {
    console.log("Dashboard data available:", !!dashboardData);
    console.log("User authenticated:", !!user);
    console.log("Loading state:", isLoading);
    console.log("Error state:", !!dashboardError);
    
    if (dashboardData) {
      console.log("Dashboard progress data:", dashboardData.progress);
    }
  }, [dashboardData, user, isLoading, dashboardError]);
  
  // Demo effect to show a welcome toast
  useEffect(() => {
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
  }, [user]);

  // Display loading state
  if (isLoading) {
    return <DashboardLoading />;
  }

  // Display error state
  if (dashboardError) {
    return <DashboardError error={dashboardError} />;
  }

  // Handle case where data is missing but no error was thrown
  if (!dashboardData) {
    return <DashboardError error={new Error("Failed to load dashboard data")} />;
  }

  // Ensure we have default data structures to prevent errors
  const safeData = {
    ...dashboardData,
    progress: dashboardData.progress || {
      xp_points: 0,
      current_level: 1,
      current_streak: 0,
      last_activity_date: new Date().toISOString()
    },
    completedScenarios: dashboardData.completedScenarios || [],
    achievements: dashboardData.achievements || [],
    recommendations: dashboardData.recommendations || []
  };

  // Mock stats data since it's not in the actual data structure
  const userStats = {
    scenariosCompleted: safeData.completedScenarios?.length || 0,
    badgesEarned: safeData.achievements?.length || 0,
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
          dashboardData={safeData} 
          userStats={userStats}
        />
      </motion.div>
      
      {/* AI Chat Widget - only visible in dashboard */}
      <AIChatWidget isOpen={isAIChatOpen} setIsOpen={setIsAIChatOpen} />
    </div>
  );
};

export default DashboardLayout;
