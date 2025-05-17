
import React from "react";
import FeatureCard from "./FeatureCard";
import { FileText, Phone, Play, MessageSquare } from "lucide-react";

const FeatureCardsGrid = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Training Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FeatureCard
          icon={FileText}
          title="RAG-Powered Knowledge Base"
          description="Access comprehensive knowledge base powered by Retrieval Augmented Generation to learn best practices for customer service."
          linkTo="/knowledge"
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <FeatureCard
          icon={Phone}
          title="Mock Call Scenarios"
          description="Practice handling customer inquiries through interactive simulations with ElevenLabs voice synthesis technology."
          linkTo="/dashboard#simulation"
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <FeatureCard
          icon={Play}
          title="Video Learning Hub"
          description="Learn from watching recorded calls of tenured agents handling different customer service scenarios."
          linkTo="/videos"
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
        <FeatureCard
          icon={MessageSquare}
          title="Tenured AI Assistant"
          description="Experience guided simulations with our AI assistant that provides real-time feedback and suggestions."
          linkTo="/dashboard#chat"
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
      </div>
    </div>
  );
};

export default FeatureCardsGrid;
