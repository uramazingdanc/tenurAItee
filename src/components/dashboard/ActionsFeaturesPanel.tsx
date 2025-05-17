
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "@/components/ui/motion";
import { FileText, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ActionFeaturesPanelProps {
  recommendedScenario: any;
}

const ActionsFeaturesPanel = ({ recommendedScenario }: ActionFeaturesPanelProps) => {
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
      
      {/* AI Assistant Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Tenured AI Assistant</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-3 bg-gray-100 p-3 rounded-lg rounded-tl-none text-sm flex-grow">
                "Hi there! Ready to practice refund scenarios today?"
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex-1"
                onClick={() => navigate('/chat-simulation')}
              >
                Yes, Let's Go
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
              >
                Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ActionsFeaturesPanel;
