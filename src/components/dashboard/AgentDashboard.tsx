
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/services/dashboardService";
import DashboardWelcomeHeader from "./DashboardWelcomeHeader";
import DashboardGrid from "./DashboardGrid";
import { motion } from "@/components/ui/motion";
import { toast } from "sonner";

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const AgentDashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState(getTimeBasedGreeting());
  const [lastActive, setLastActive] = useState("Just now");
  
  // Get dashboard data from API
  const { data: dashboardData, error: dashboardError, isLoading } = useQuery({
    queryKey: ['dashboardData', user?.id],
    queryFn: fetchDashboardData,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Handle errors with useEffect
  useEffect(() => {
    if (dashboardError) {
      console.error('Dashboard error:', dashboardError);
      toast.error('Failed to load dashboard data', {
        description: 'Please try refreshing the page',
      });
    }
  }, [dashboardError]);

  // Update greeting based on time of day
  useEffect(() => {
    const intervalId = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);

  // Set last active time from dashboard data
  useEffect(() => {
    if (dashboardData?.progress?.last_activity_date) {
      const lastActivityDate = new Date(dashboardData.progress.last_activity_date);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - lastActivityDate.getTime()) / 60000);
      
      if (diffInMinutes < 1) {
        setLastActive("Just now");
      } else if (diffInMinutes < 60) {
        setLastActive(`${diffInMinutes} minutes ago`);
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        setLastActive(`${hours} ${hours === 1 ? 'hour' : 'hours'} ago`);
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        setLastActive(`${days} ${days === 1 ? 'day' : 'days'} ago`);
      }
    }
  }, [dashboardData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardError || !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 p-4 rounded-md border border-red-200">
          <h2 className="text-red-600 font-semibold text-lg">Failed to load dashboard</h2>
          <p className="text-red-500">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // For the demo, create some metrics for the radar chart
  const userMetrics = {
    empathy: dashboardData.performance?.customer_satisfaction || 85,
    accuracy: dashboardData.performance?.response_accuracy || 80,
    speed: dashboardData.performance?.issue_resolution_rate || 75,
    knowledge: 82,
    communication: 79
  };
  
  // Get user name and streak from dashboard data
  const userName = user?.user_metadata?.full_name || 'Agent';
  const currentStreak = dashboardData.progress?.current_streak || 0;
  const userLevel = dashboardData.progress?.current_level || 1;
  
  return (
    <motion.div 
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DashboardWelcomeHeader 
        greeting={greeting}
        userName={userName}
        lastActive={lastActive}
        userLevel={userLevel}
        streak={currentStreak}
        userTitle={dashboardData.profile?.role || "Support Agent"}
        userAvatar={dashboardData.profile?.avatar_url}
      />
      
      <DashboardGrid 
        userMetrics={userMetrics}
        dashboardData={dashboardData}
      />
    </motion.div>
  );
};

export default AgentDashboard;
