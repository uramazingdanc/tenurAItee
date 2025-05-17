
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "@/components/ui/motion";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserProgress } from "@/services/scenarioService";
import AIChatWidget from "@/components/AIChatWidget";
import MotionProgressRing from "@/components/MotionProgressRing";

const Dashboard = () => {
  const [progress, setProgress] = useState(65);
  const [userStats, setUserStats] = useState({
    scenariosCompleted: 12,
    badgesEarned: 8,
    avgRating: 4.8,
  });
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { user } = useAuth();
  
  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Fetch user progress data when the component mounts
  useEffect(() => {
    if (user?.id) {
      fetchUserProgress(user.id)
        .then(progressData => {
          console.log("User progress data:", progressData);
          // In a real implementation, we would update the state with this data
        })
        .catch(error => {
          console.error("Error fetching user progress:", error);
        });
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <motion.h1 
              className="text-3xl font-bold heading-gradient"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Agent Dashboard
            </motion.h1>
            <motion.p 
              className="text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Track your progress and continue your training
            </motion.p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <motion.div 
              className="bg-white border border-gray-200 rounded-md px-4 py-2 flex items-center mr-3"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-sm mr-3">
                {user?.user_metadata?.full_name?.split(' ').map(name => name[0]).join('') || 'JS'}
              </div>
              <span className="font-medium">{user?.user_metadata?.full_name || 'John Smith'}</span>
            </motion.div>
            <Button variant="outline">Settings</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Progress</CardTitle>
                    <CardDescription>Track your training milestones and achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">Level 3: Advanced Problem Solving</span>
                      <span className="text-sm text-gray-500">{progress}%</span>
                    </div>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{ transformOrigin: "left" }}
                    >
                      <Progress value={progress} className="h-2 mb-6" />
                    </motion.div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <motion.div variants={cardVariants}>
                        <Card className="bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 border-0">
                          <CardContent className="p-4">
                            <div className="text-4xl font-bold text-brand-blue mb-1">{userStats.scenariosCompleted}</div>
                            <div className="text-sm text-gray-600">Scenarios Completed</div>
                          </CardContent>
                        </Card>
                      </motion.div>
                      <motion.div variants={cardVariants}>
                        <Card className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 border-0">
                          <CardContent className="p-4">
                            <div className="text-4xl font-bold text-brand-green mb-1">{userStats.badgesEarned}</div>
                            <div className="text-sm text-gray-600">Badges Earned</div>
                          </CardContent>
                        </Card>
                      </motion.div>
                      <motion.div variants={cardVariants}>
                        <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-0">
                          <CardContent className="p-4">
                            <div className="text-4xl font-bold text-purple-600 mb-1">{userStats.avgRating}</div>
                            <div className="text-sm text-gray-600">Avg. Customer Rating</div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <Tabs defaultValue="scenarios">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="learning">Learning Path</TabsTrigger>
              </TabsList>
              
              <TabsContent value="scenarios">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Scenarios</CardTitle>
                    <CardDescription>Practice with these customer service scenarios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Flight Cancellation",
                          description: "Handle a customer requesting a flight cancellation due to emergency",
                          difficulty: "Beginner",
                          completion: 100,
                          status: "completed"
                        },
                        {
                          title: "Booking Modification",
                          description: "Help customer change travel dates and accommodate special requests",
                          difficulty: "Intermediate",
                          completion: 75,
                          status: "in-progress"
                        },
                        {
                          title: "Lost Luggage Complaint",
                          description: "Address customer concerns about lost luggage and file a claim",
                          difficulty: "Advanced",
                          completion: 0,
                          status: "locked"
                        }
                      ].map((scenario, index) => (
                        <motion.div 
                          key={index} 
                          className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
                          whileHover={{ scale: 1.01 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center mb-1">
                              <h3 className="font-medium text-lg">{scenario.title}</h3>
                              <Badge className={`ml-2 ${
                                scenario.difficulty === "Beginner" ? "bg-green-500" : 
                                scenario.difficulty === "Intermediate" ? "bg-brand-blue" : 
                                "bg-purple-600"
                              }`}>
                                {scenario.difficulty}
                              </Badge>
                            </div>
                            <p className="text-gray-500 text-sm">{scenario.description}</p>
                            {scenario.completion > 0 && scenario.completion < 100 && (
                              <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-500">Progress</span>
                                  <span className="text-xs text-gray-500">{scenario.completion}%</span>
                                </div>
                                <Progress value={scenario.completion} className="h-1.5" />
                              </div>
                            )}
                          </div>
                          <Button 
                            className={`
                              ${scenario.status === "completed" ? "bg-green-500 hover:bg-green-600" : 
                                scenario.status === "in-progress" ? "bg-brand-blue hover:bg-brand-blue-dark" : 
                                "bg-gray-300 hover:bg-gray-300 cursor-not-allowed"}
                            `}
                            disabled={scenario.status === "locked"}
                          >
                            {scenario.status === "completed" ? "Review" : 
                              scenario.status === "in-progress" ? "Continue" : 
                              "Locked"}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Achievements</CardTitle>
                    <CardDescription>Badges and rewards you've earned</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        {
                          name: "First Call",
                          description: "Completed your first call scenario",
                          icon: "🎯",
                          unlocked: true
                        },
                        {
                          name: "Problem Solver",
                          description: "Successfully resolved 5 customer issues",
                          icon: "🔍",
                          unlocked: true
                        },
                        {
                          name: "De-escalation Pro",
                          description: "Calmed 3 upset customers",
                          icon: "😌",
                          unlocked: true
                        },
                        {
                          name: "Knowledge Master",
                          description: "Read all basic knowledge articles",
                          icon: "📚",
                          unlocked: false
                        }
                      ].map((badge, index) => (
                        <motion.div
                          key={index}
                          whileHover={badge.unlocked ? { scale: 1.05, y: -5 } : {}}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <Card className={`text-center p-4 ${!badge.unlocked && "opacity-50 grayscale"}`}>
                            <div className="text-4xl mb-2">{badge.icon}</div>
                            <h4 className="font-medium">{badge.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                            {!badge.unlocked && (
                              <Badge variant="outline" className="mt-2 mx-auto">Locked</Badge>
                            )}
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="learning">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Learning Path</CardTitle>
                    <CardDescription>Follow this path to mastery</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-8 pb-8">
                      <div className="absolute top-0 bottom-0 left-4 w-px bg-gray-200"></div>
                      
                      {[
                        {
                          title: "Customer Service Basics",
                          description: "Learn foundational skills for successful customer interactions",
                          status: "completed",
                          modules: ["Active Listening", "Empathy in Service", "Clear Communication"]
                        },
                        {
                          title: "Travel Industry Knowledge",
                          description: "Understanding the travel industry context and common issues",
                          status: "in-progress",
                          modules: ["Booking Policies", "Cancellation Procedures", "Travel Insurance Basics"]
                        },
                        {
                          title: "Advanced Problem Solving",
                          description: "Tackle complex customer problems efficiently",
                          status: "locked",
                          modules: ["Multi-Issue Resolution", "Creative Solutions", "Exception Handling"]
                        }
                      ].map((path, index) => (
                        <motion.div 
                          key={index} 
                          className="mb-8 relative"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + (index * 0.2), duration: 0.4 }}
                        >
                          <motion.div 
                            className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-2 ${
                              path.status === "completed" ? "bg-green-500 border-green-500" :
                              path.status === "in-progress" ? "bg-white border-brand-blue" :
                              "bg-white border-gray-300"
                            } flex items-center justify-center z-10`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + (index * 0.2), duration: 0.3, type: "spring" }}
                          >
                            {path.status === "completed" && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </motion.div>
                          <div>
                            <h3 className={`font-medium text-lg ${path.status === "locked" ? "text-gray-400" : ""}`}>
                              {path.title}
                            </h3>
                            <p className={`text-sm ${path.status === "locked" ? "text-gray-400" : "text-gray-500"} mb-3`}>
                              {path.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {path.modules.map((module, i) => (
                                <Badge 
                                  key={i}
                                  variant="outline" 
                                  className={path.status === "locked" ? "text-gray-400 border-gray-300" : ""}
                                >
                                  {module}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Progress</span>
                    <MotionProgressRing progress={65} size={38} strokeWidth={4} />
                  </CardTitle>
                  <CardDescription>Level 3: Advanced Agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-1">2,500 / 5,000 XP</div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">Current streak: <span className="font-bold text-brand-blue">5 days</span></div>
                    <div className="text-xs text-gray-500">Next reward: <span className="font-bold text-amber-500">500 XP</span></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recommended For You</CardTitle>
                  <CardDescription>Based on your progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: "De-escalation Techniques",
                      type: "video",
                      duration: "8 min",
                      icon: "play"
                    },
                    {
                      title: "Travel Insurance FAQ",
                      type: "article",
                      duration: "5 min read",
                      icon: "document"
                    },
                    {
                      title: "Handling Refund Requests",
                      type: "practice",
                      duration: "",
                      icon: "practice"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="border rounded-md p-3 hover:border-brand-blue hover:bg-brand-blue/5 cursor-pointer transition-colors"
                      whileHover={{ scale: 1.02, x: 5 }}
                      // Fixed the duplicate transition attribute by removing it
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1), duration: 0.3 }}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded flex items-center justify-center mr-3 ${
                          item.icon === "play" ? "bg-purple-100 text-purple-600" :
                          item.icon === "document" ? "bg-blue-100 text-blue-600" :
                          "bg-green-100 text-green-600"
                        }`}>
                          {item.icon === "play" && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 17.5L16 12L9 6.5V17.5Z" fill="currentColor" />
                            </svg>
                          )}
                          {item.icon === "document" && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                              <path d="M9 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <path d="M9 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          )}
                          {item.icon === "practice" && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 5H5V19H19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{item.title}</h3>
                          <p className="text-xs text-gray-500">
                            {item.type === "video" && "Video • "}
                            {item.type === "article" && "Article • "}
                            {item.type === "practice" && "Practice scenario"}
                            {item.duration}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Performance Stats</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Customer Satisfaction</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Response Accuracy</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Issue Resolution Rate</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h4 className="font-medium text-sm mb-3">Areas for improvement:</h4>
                    <div className="space-y-2">
                      <div className="text-xs flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                        <span>Handling multiple requests at once</span>
                      </div>
                      <div className="text-xs flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                        <span>Policy explanation clarity</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* AI Chat Widget */}
      <AIChatWidget isOpen={isAIChatOpen} setIsOpen={setIsAIChatOpen} />
    </div>
  );
};

export default Dashboard;
