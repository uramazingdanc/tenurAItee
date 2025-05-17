
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CallSimulation from "@/components/CallSimulation";
import KnowledgeBase from "@/components/KnowledgeBase";
import VideoHub from "@/components/VideoHub";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <CallSimulation />
      <KnowledgeBase />
      <VideoHub />
      <Footer />
    </div>
  );
};

export default Index;
