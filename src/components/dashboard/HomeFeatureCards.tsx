
import React from "react";
import { FileText, Phone, Play, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "@/components/ui/motion";
import { useNavigate } from "react-router-dom";

const HomeFeatureCards = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      iconBg: "bg-blue-100",
      title: "RAG-Powered Knowledge Base",
      description: "Access a comprehensive knowledge base powered by Retrieval Augmented Generation to learn best practices for customer service.",
      link: "/knowledge"
    },
    {
      icon: <Phone className="h-6 w-6 text-green-500" />,
      iconBg: "bg-green-100",
      title: "Mock Call Scenarios",
      description: "Practice handling customer inquiries through interactive simulations with ElevenLabs voice synthesis technology.",
      link: "/scenarios"
    },
    {
      icon: <Play className="h-6 w-6 text-indigo-500" />,
      iconBg: "bg-indigo-100",
      title: "Video Learning Hub",
      description: "Learn from watching recorded calls of tenured agents handling different customer service scenarios.",
      link: "/videos"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
      iconBg: "bg-purple-100",
      title: "Tenured AI Assistant",
      description: "Experience guided simulations with our AI assistant that provides real-time feedback and suggestions.",
      link: "/chat-simulation"
    }
  ];

  const handleFeatureClick = (link) => {
    navigate(link);
  };

  return (
    <div className="py-8">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent mb-4">
          Train Smarter with AI-Powered Tools
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Our platform offers a variety of features designed to enhance the skills of your customer service representatives.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => handleFeatureClick(feature.link)}
            className="cursor-pointer"
          >
            <div className="block h-full border rounded-lg p-6 bg-white hover:shadow-md transition-all duration-300">
              <div className={`w-12 h-12 ${feature.iconBg} rounded-full flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomeFeatureCards;
