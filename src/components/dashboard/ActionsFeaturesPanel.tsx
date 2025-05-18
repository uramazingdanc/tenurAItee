
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "@/components/ui/motion";
import { FileText, Phone, Play, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TenuredAIAssistant from "./TenuredAIAssistant";

interface ActionFeaturesPanelProps {
  recommendedScenario: any;
  recentCallData?: any;
  userProgress?: any;
}

const ActionsFeaturesPanel = ({ 
  recommendedScenario, 
  recentCallData,
  userProgress 
}: ActionFeaturesPanelProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      {/* Knowledge Base Feature Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate('/knowledge')}
        className="cursor-pointer"
      >
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">RAG Knowledge Base</CardTitle>
                <div className="text-xs text-green-600 font-medium mt-1">
                  ● Recently updated
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-1 text-sm text-gray-600">
              Access comprehensive knowledge to learn best practices
            </div>
            <div className="mt-3 bg-blue-50 rounded p-2 text-xs text-blue-700">
              📚 3 new articles | 🏆 92% quiz avg
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Call Simulator Feature Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        onClick={() => navigate('/scenarios')}
        className="cursor-pointer"
      >
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Mock Call Simulator</CardTitle>
                <div className="text-xs text-gray-500 font-medium mt-1">
                  Press <kbd className="px-1 py-0.5 text-xs rounded border bg-gray-100">M</kbd> for quick access
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-1 text-sm text-gray-600">
              Practice handling customer inquiries with ElevenLabs voice synthesis
            </div>
            
            {recommendedScenario && (
              <div className="mt-3 bg-amber-50 rounded p-2 text-xs text-amber-800">
                <strong>Recommended:</strong> {recommendedScenario.title || "Lost Luggage Scenario"}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Enhanced AI Assistant Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <TenuredAIAssistant 
          recentCallData={recentCallData} 
          userProgress={userProgress}
        />
      </motion.div>
      
      {/* Video Learning Hub Card - NEW CARD ADDED HERE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        onClick={() => navigate('/videos')}
        className="cursor-pointer"
      >
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <Play className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Video Learning Hub</CardTitle>
                <div className="text-xs text-blue-500 font-medium mt-1">
                  ● 4 new videos added
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-1 text-sm text-gray-600">
              Learn from watching experienced agents handle challenging scenarios
            </div>
            <div className="mt-3 bg-indigo-50 rounded p-2 text-xs text-indigo-700">
              🎬 Popular: Flight Cancellations | Angry Customers
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ActionsFeaturesPanel;
