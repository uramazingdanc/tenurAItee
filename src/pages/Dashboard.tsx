
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  const [progress, setProgress] = useState(65);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold heading-gradient">Agent Dashboard</h1>
            <p className="text-gray-500 mt-1">Track your progress and continue your training</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="bg-white border border-gray-200 rounded-md px-4 py-2 flex items-center mr-3">
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-sm mr-3">
                JS
              </div>
              <span className="font-medium">John Smith</span>
            </div>
            <Button variant="outline">Settings</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                <Progress value={progress} className="h-2 mb-6" />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 border-0">
                    <CardContent className="p-4">
                      <div className="text-4xl font-bold text-brand-blue mb-1">12</div>
                      <div className="text-sm text-gray-600">Scenarios Completed</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 border-0">
                    <CardContent className="p-4">
                      <div className="text-4xl font-bold text-brand-green mb-1">8</div>
                      <div className="text-sm text-gray-600">Badges Earned</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-0">
                    <CardContent className="p-4">
                      <div className="text-4xl font-bold text-purple-600 mb-1">4.8</div>
                      <div className="text-sm text-gray-600">Avg. Customer Rating</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

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
                        <div key={index} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between">
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
                        </div>
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
                        <Card key={index} className={`text-center p-4 ${!badge.unlocked && "opacity-50 grayscale"}`}>
                          <div className="text-4xl mb-2">{badge.icon}</div>
                          <h4 className="font-medium">{badge.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                          {!badge.unlocked && (
                            <Badge variant="outline" className="mt-2 mx-auto">Locked</Badge>
                          )}
                        </Card>
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
                        <div key={index} className="mb-8 relative">
                          <div className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-2 ${
                            path.status === "completed" ? "bg-green-500 border-green-500" :
                            path.status === "in-progress" ? "bg-white border-brand-blue" :
                            "bg-white border-gray-300"
                          } flex items-center justify-center z-10`}>
                            {path.status === "completed" && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
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
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended For You</CardTitle>
                <CardDescription>Based on your progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md p-3 hover:border-brand-blue hover:bg-brand-blue/5 cursor-pointer transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center text-purple-600 mr-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 17.5L16 12L9 6.5V17.5Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">De-escalation Techniques</h3>
                      <p className="text-xs text-gray-500">8 min video</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-3 hover:border-brand-blue hover:bg-brand-blue/5 cursor-pointer transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-blue-600 mr-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M9 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M9 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Travel Insurance FAQ</h3>
                      <p className="text-xs text-gray-500">Article • 5 min read</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-3 hover:border-brand-blue hover:bg-brand-blue/5 cursor-pointer transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-green-600 mr-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 5H5V19H19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Handling Refund Requests</h3>
                      <p className="text-xs text-gray-500">Practice scenario</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
