
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";
import CallSimulation from "@/components/CallSimulation";
import RecommendedScenarios from "@/components/RecommendedScenarios";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      
      {/* Show recommended scenarios for logged in users */}
      {user && (
        <div className="container mx-auto px-4 py-12">
          <RecommendedScenarios />
        </div>
      )}
      
      <CallSimulation />
      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default Index;
