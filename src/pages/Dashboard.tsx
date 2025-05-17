
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KnowledgeBase from "@/components/KnowledgeBase";
import VideoHub from "@/components/VideoHub";
import CallSimulation from "@/components/CallSimulation";
import AIChatWidget from "@/components/AIChatWidget";
import { useState } from "react";
import HomeFeatureCards from "@/components/dashboard/HomeFeatureCards";
import AgentDashboard from "@/components/dashboard/AgentDashboard";

const Dashboard = () => {
  const location = useLocation();
  const path = location.pathname;
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Determine which content to show based on the current path
  const renderContent = () => {
    if (path === "/knowledge") {
      return <KnowledgeBase />;
    } else if (path === "/videos") {
      return <VideoHub />;
    } else if (path === "/scenarios" || path.startsWith("/scenarios/")) {
      return <CallSimulation />;
    } else if (path === "/chat-simulation") {
      return (
        <div className="container mx-auto px-4 py-12">
          <CallSimulation isGuidedMode={true} />
        </div>
      );
    } else {
      // Default to showing the agent dashboard
      return <AgentDashboard />;
    }
  };

  // Only show standalone AI chat widget in non-dashboard pages
  // For the main dashboard we're using the integrated TenuredAIAssistant
  const showChatWidget = path !== "/" && 
                         path !== "/dashboard" &&
                         ["/chat-simulation", "/knowledge", "/videos", "/scenarios"].some(
                           route => path === route || path.startsWith(route + "/")
                         );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {renderContent()}
      {showChatWidget && (
        <AIChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      )}
    </div>
  );
};

export default Dashboard;
