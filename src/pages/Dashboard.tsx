
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KnowledgeBase from "@/components/KnowledgeBase";
import VideoHub from "@/components/VideoHub";
import CallSimulation from "@/components/CallSimulation";
import AIChatWidget from "@/components/AIChatWidget";

const Dashboard = () => {
  const location = useLocation();
  const path = location.pathname;
  
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
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Guided Simulations</h2>
          <p className="mb-4">Experience step-by-step guided call simulations with AI feedback.</p>
          <AIChatWidget isOpen={true} setIsOpen={() => {}} />
        </div>
      );
    } else {
      // Default to showing the dashboard home
      return <DashboardLayout />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {renderContent()}
    </div>
  );
};

export default Dashboard;
