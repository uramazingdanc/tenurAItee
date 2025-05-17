
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import DashboardError from "@/components/dashboard/DashboardError";
import { fetchDashboardData } from "@/services/dashboardService";
import { useAuth } from "@/contexts/AuthContext";

const AgentDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Removing the argument here, as fetchDashboardData doesn't expect one
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user]);
  
  // Prepare user metrics for the dashboard
  const userMetrics = {
    empathy: dashboardData?.performance?.customer_satisfaction || 85,
    accuracy: dashboardData?.performance?.response_accuracy || 90,
    speed: dashboardData?.performance?.issue_resolution_rate || 82,
    knowledge: dashboardData?.performance?.knowledge_score || 88,
    communication: dashboardData?.performance?.communication_score || 87
  };
  
  // Get most recent call data for the AI assistant
  const recentCallData = dashboardData?.completedScenarios?.[0] || null;

  if (isLoading) return <DashboardLoading />;
  if (error) return <DashboardError error={error} />;

  return (
    <div className="container mx-auto px-4 pb-12">
      <DashboardHeader user={user} />
      
      <DashboardGrid 
        userMetrics={userMetrics} 
        dashboardData={dashboardData || {}}
        recentCallData={recentCallData}
      />
    </div>
  );
};

export default AgentDashboard;
