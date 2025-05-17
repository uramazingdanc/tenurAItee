
import { motion } from "@/components/ui/motion";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

interface ProgressStats {
  level: number;
  xpProgress: number;
  scenariosCompleted: number;
  badgesEarned: number;
  avgRating: number;
  skillName: string;
}

const ProgressSection = ({ 
  level = 1, 
  xpProgress = 5, 
  scenariosCompleted = 0, 
  badgesEarned = 0, 
  avgRating = 4.8,
  skillName = "Advanced Problem Solving"
}: Partial<ProgressStats>) => {
  const navigate = useNavigate();
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  const handleSkillClick = () => {
    // Simulate API call to fetch skill data
    console.log("Fetching skill data: GET /progress/skills/advanced_problem_solving");
    setShowSkillModal(true);
  };
  
  const handleRatingClick = () => {
    // Simulate API call to fetch rating data
    console.log("Fetching rating data: GET /feedback?type=voice&limit=5");
    setShowRatingModal(true);
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="flex items-center mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
            onClick={handleSkillClick}
          >
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Level {level}: <span className="font-medium">{skillName}</span></p>
              <Progress value={xpProgress} className="h-2" />
            </div>
            <span className="text-sm text-gray-600">{xpProgress}%</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 p-4 rounded">
              <motion.h3
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.1 }}
                className="text-3xl font-bold"
              >
                {scenariosCompleted}
              </motion.h3>
              <p className="text-xs text-gray-500">Scenarios Completed</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <motion.h3
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 }}
                className="text-3xl font-bold"
              >
                {badgesEarned}
              </motion.h3>
              <p className="text-xs text-gray-500">Badges Earned</p>
            </div>
            
            <div 
              className="bg-gray-50 p-4 rounded cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={handleRatingClick}
            >
              <motion.h3
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.3 }}
                className="text-3xl font-bold text-purple-600"
              >
                {avgRating}
              </motion.h3>
              <p className="text-xs text-gray-500">Avg. Customer Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Skill Breakdown Modal */}
      <Dialog open={showSkillModal} onOpenChange={setShowSkillModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Skill Breakdown: {skillName}</DialogTitle>
            <DialogDescription>
              Your progress in developing advanced problem-solving abilities
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Key Components</h4>
              <ul className="space-y-2">
                <li className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Critical Thinking</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-1.5" />
                </li>
                <li className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Decision Making</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-1.5" />
                </li>
                <li className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Conflict Resolution</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-1.5" />
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Suggested Improvement Areas</h4>
              <ul className="text-sm list-disc ml-5 space-y-1 text-gray-600">
                <li>Complete the "Conflict Resolution" module</li>
                <li>Practice more customer complaint scenarios</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Customer Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Feedback Analysis</DialogTitle>
            <DialogDescription>
              Recent feedback from your customer interactions
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Recent Feedback</h4>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Flight Cancellation Scenario</span>
                    <span className="text-green-600 font-medium">★★★★★</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    "Agent was very helpful and understanding of my situation. Provided clear options quickly."
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Refund Request Scenario</span>
                    <span className="text-yellow-600 font-medium">★★★★☆</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    "Process was explained well, but took a bit longer than expected."
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Highest Rated Skills</h4>
              <ul className="text-sm list-disc ml-5 space-y-1 text-gray-600">
                <li>Empathy (4.9/5)</li>
                <li>Clear Communication (4.7/5)</li>
                <li>Problem Resolution (4.5/5)</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProgressSection;
