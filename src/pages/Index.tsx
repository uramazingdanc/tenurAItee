
import { useState, useEffect } from "react";
import { motion, staggerContainer } from "@/components/ui/motion";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import CallSimulation from "@/components/CallSimulation";
import RecommendedScenarios from "@/components/RecommendedScenarios";
import { useAuth } from "@/contexts/AuthContext";
import HomeFeatureCards from "@/components/dashboard/HomeFeatureCards";
import Features from "@/components/Features";

const Index = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger for sections as they come into view
  useEffect(() => {
    setIsVisible(true);
    
    // Add intersection observer for scroll animations if needed
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      className="flex flex-col min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <motion.section
        className="scroll-animate py-16 bg-gradient-to-b from-white to-gray-50"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 heading-gradient"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Why Choose tenurAItee?
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Our platform offers innovative AI-powered tools designed specifically for customer service training in the travel industry.
            </motion.p>
          </div>
          
          <HomeFeatureCards />
        </div>
      </motion.section>
      
      {/* Recommended Scenarios for logged-in users */}
      {user && (
        <motion.section 
          className="scroll-animate py-16 bg-white"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="container mx-auto px-4">
            <RecommendedScenarios />
          </div>
        </motion.section>
      )}
      
      {/* Interactive Demo Section */}
      <motion.section
        className="scroll-animate py-16 bg-gradient-to-b from-gray-50 to-white"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <div className="container mx-auto px-4 mb-10">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 heading-gradient"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Try Our Interactive Demo
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Experience a preview of our AI-powered call simulation technology.
            </motion.p>
          </div>
        </div>
        
        <CallSimulation isGuidedMode={false} />
      </motion.section>
      
      {/* Features detail section */}
      <Features />
      
      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default Index;
