
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen, Phone, FileText, Ban, CreditCard } from "lucide-react";
import { fetchKnowledgeItems, KnowledgeCategory } from "@/services/knowledgeService";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from '@/components/ui/motion';
import { KnowledgeModule, getUserLearningPath } from '@/services/learningPathService';
import { KnowledgeModulePopup } from './learning-path/KnowledgeModulePopup';

// Knowledge categories based on the requested tabs
const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  {
    id: 'handling_calls',
    name: 'Handling Calls',
    description: 'De-escalation scripts, tone guidelines, call flowcharts',
    icon: Phone,
    quizExample: 'Which phrase best demonstrates active listening?'
  },
  {
    id: 'process_bookings',
    name: 'Process Bookings',
    description: 'Step-by-step booking workflow, common errors, verification protocols',
    icon: FileText,
    quizExample: 'Identify the 3 mandatory fields for new bookings'
  },
  {
    id: 'modify_bookings',
    name: 'Modify Bookings',
    description: 'Policy exceptions, fee structures, system navigation screenshots',
    icon: FileText,
    quizExample: 'Calculate change fees for a date modification 48hrs pre-departure'
  },
  {
    id: 'cancel_bookings',
    name: 'Cancel Bookings',
    description: 'Refund eligibility tables, cancellation scripts, retention strategies',
    icon: Ban,
    quizExample: 'Which cancellation reason qualifies for full refund under DOT regulations?'
  },
  {
    id: 'refund_requests',
    name: 'Refund Requests',
    description: 'Dispute resolution paths, documentation requirements, approval workflow',
    icon: CreditCard,
    quizExample: 'Match each refund type to its processing timeline'
  }
];

const KnowledgeBase = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<KnowledgeModule | null>(null);
  const [currentTab, setCurrentTab] = useState('handling_calls');
  
  // Fetch knowledge categories from backend
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['knowledgeCategories'],
    queryFn: () => Promise.resolve([] as KnowledgeCategory[]), // We're using hardcoded categories for now
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch learning modules (to be integrated with knowledge base)
  const { data: modules, isLoading: isModulesLoading } = useQuery({
    queryKey: ['learningModules', user?.id],
    queryFn: () => getUserLearningPath(user?.id || ''),
    enabled: !!user,
  });

  // Determine which categories to display - backend data or fallback
  const displayCategories = categories.length > 0 ? categories : KNOWLEDGE_CATEGORIES;

  // Filter knowledge items by search query if provided
  const filteredCategories = searchQuery.trim() 
    ? displayCategories.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayCategories;
    
  // Handle module selection
  const handleModuleClick = (module: KnowledgeModule) => {
    setSelectedModule(module);
  };
  
  // Handle module close
  const handleModuleClose = () => {
    setSelectedModule(null);
  };

  return (
    <section className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">RAG-Powered Knowledge Base</h1>
            <p className="text-gray-600 max-w-2xl">
              Access a comprehensive knowledge base powered by Retrieval Augmented Generation to learn best practices for customer service.
            </p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="search"
                placeholder="Search knowledge base..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-1 mb-8">
          <Tabs 
            defaultValue={currentTab} 
            className="w-full"
            onValueChange={setCurrentTab}
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
              {KNOWLEDGE_CATEGORIES.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {KNOWLEDGE_CATEGORIES.map((category) => (
              <TabsContent key={category.id} value={category.id} className="p-4">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <category.icon className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
                
                <Separator className="my-6" />

                {/* Knowledge modules by category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {isModulesLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <Skeleton className="h-4 w-1/2 mb-2" />
                          <Skeleton className="h-4 w-3/4" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-32 w-full" />
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    modules?.filter(m => m.id.includes(category.id)).map((module) => (
                      <Card 
                        key={module.id}
                        className={`overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${
                          module.status === 'locked' ? 'opacity-70' : ''
                        } hover:border-blue-400`}
                        onClick={() => module.status !== 'locked' && handleModuleClick(module)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            {module.name}
                            {module.status === 'locked' && (
                              <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                                Locked
                              </span>
                            )}
                            {module.status === 'completed' && (
                              <span className="ml-2 text-xs bg-green-100 px-2 py-1 rounded text-green-600">
                                Completed
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-sm text-gray-600 mb-4">
                            {module.content.substring(0, 100)}...
                          </div>
                          {module.status !== 'locked' && (
                            <Button size="sm" variant="outline" className="mt-2">
                              <BookOpen className="h-4 w-4 mr-2" />
                              View Module
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Quiz section */}
                <div className="mt-12 bg-gray-50 p-6 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Knowledge Check</h3>
                  <p className="text-gray-600 mb-4">Test your knowledge with a quick quiz:</p>
                  <div className="p-4 bg-white rounded-lg border">
                    <p className="font-medium text-gray-800 mb-4">{category.quizExample}</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="radio" id="option1" name="quiz" className="mr-2" />
                        <label htmlFor="option1">Option A</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="option2" name="quiz" className="mr-2" />
                        <label htmlFor="option2">Option B</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="option3" name="quiz" className="mr-2" />
                        <label htmlFor="option3">Option C</label>
                      </div>
                    </div>
                    <Button className="mt-4">Submit Answer</Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Knowledge Module Popup */}
        {selectedModule && (
          <KnowledgeModulePopup 
            module={selectedModule} 
            onClose={handleModuleClose} 
            userId={user?.id || ''} 
          />
        )}
      </motion.div>
    </section>
  );
};

export default KnowledgeBase;
