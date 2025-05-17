
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from '@/components/ui/sonner';
import { Book, Check, ChevronLeft, ChevronRight, ClipboardCheck } from 'lucide-react';
import { KnowledgeModule, trackModuleView, updateModuleStatus, submitQuizAnswers } from '@/services/learningPathService';
import ReactMarkdown from 'react-markdown';

export interface KnowledgeModulePopupProps {
  module: KnowledgeModule;
  onClose: () => void;
  userId: string;
}

export const KnowledgeModulePopup = ({ module, onClose, userId }: KnowledgeModulePopupProps) => {
  const [activeTab, setActiveTab] = useState('content');
  const [viewStartTime, setViewStartTime] = useState(Date.now());
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    correct: number;
    total: number;
    isModuleCompleted: boolean;
  } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track time spent on module
  useEffect(() => {
    setViewStartTime(Date.now());
    
    // Track module view at beginning
    if (userId) {
      trackModuleView(userId, module.id);
    }
    
    // Track time spent when component unmounts
    return () => {
      const timeSpent = Math.floor((Date.now() - viewStartTime) / 1000); // time in seconds
      if (userId && timeSpent > 1) { // Only track if more than 1 second
        trackModuleView(userId, module.id, timeSpent);
      }
    };
  }, [module.id, userId]);

  // Handle module completion
  const handleCompleteModule = async () => {
    if (!userId) {
      toast.error("You need to be logged in to track progress");
      return;
    }
    
    const success = await updateModuleStatus(userId, module.id, 'completed');
    
    if (success) {
      toast.success("Module marked as completed!", {
        description: "Your progress has been saved."
      });
      onClose();
    } else {
      toast.error("Failed to update module status");
    }
  };

  // Handle quiz answer selection
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (quizSubmitted) return;
    
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  // Handle quiz submission
  const handleSubmitQuiz = async () => {
    if (!userId) {
      toast.error("You need to be logged in to submit quizzes");
      return;
    }
    
    // Check if all questions are answered
    if (module.quiz && quizAnswers.length < module.quiz.length) {
      toast.warning("Please answer all questions before submitting");
      return;
    }
    
    const result = await submitQuizAnswers(userId, module.id, quizAnswers);
    setQuizResult(result);
    setQuizSubmitted(true);
    
    if (result.isModuleCompleted) {
      toast.success("Congratulations! You passed the quiz!", {
        description: `You scored ${result.score.toFixed(0)}% and completed this module.`
      });
    } else {
      toast.info("Quiz submitted", {
        description: `You scored ${result.score.toFixed(0)}%. You need 70% to complete this module.`
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Book className="mr-2 h-5 w-5" />
            {module.name}
            {module.status === 'completed' && (
              <span className="ml-2 text-xs bg-green-100 px-2 py-1 rounded text-green-600">
                Completed
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="content" className="mt-4 flex-grow flex flex-col" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="quiz" disabled={!module.quiz?.length}>
              Quiz {module.quiz?.length ? `(${module.quiz.length})` : ''}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="flex-grow overflow-auto p-4" ref={contentRef}>
            <div className="prose prose-blue max-w-none">
              <ReactMarkdown>
                {module.content}
              </ReactMarkdown>
            </div>
            
            {module.actions && module.actions.length > 0 && (
              <div className="mt-8 pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Actions</h3>
                <div className="flex flex-wrap gap-3">
                  {module.actions.map((action, index) => (
                    <Button key={index} variant="outline" className="flex items-center">
                      <span className="mr-2" aria-hidden="true">{action.icon}</span>
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="quiz" className="flex-grow overflow-auto p-4">
            {module.quiz && module.quiz.length > 0 ? (
              <div className="space-y-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800">Knowledge Check</h3>
                  <p className="text-blue-700 text-sm">
                    Complete this quiz to test your understanding of the module content.
                    You need 70% to pass.
                  </p>
                </div>
                
                {quizSubmitted && quizResult && (
                  <div className={`p-4 rounded-lg ${
                    quizResult.isModuleCompleted ? 'bg-green-50' : 'bg-amber-50'
                  }`}>
                    <h3 className={`font-medium ${
                      quizResult.isModuleCompleted ? 'text-green-800' : 'text-amber-800'
                    }`}>
                      Quiz Result
                    </h3>
                    <div className="mt-2">
                      <Progress 
                        value={quizResult.score} 
                        className={`h-2 ${
                          quizResult.isModuleCompleted ? 'bg-green-200' : 'bg-amber-200'
                        }`}
                      />
                      <div className="flex justify-between mt-1 text-sm">
                        <span>{quizResult.correct}/{quizResult.total} correct</span>
                        <span className="font-medium">{quizResult.score.toFixed(0)}%</span>
                      </div>
                    </div>
                    <p className={`mt-3 text-sm ${
                      quizResult.isModuleCompleted ? 'text-green-700' : 'text-amber-700'
                    }`}>
                      {quizResult.isModuleCompleted 
                        ? "Congratulations! You've completed this module."
                        : "You need 70% to complete this module. Review the content and try again."}
                    </p>
                  </div>
                )}
                
                {module.quiz.map((question, qIndex) => (
                  <div key={qIndex} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">
                      Question {qIndex + 1}: {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <div 
                          key={oIndex} 
                          onClick={() => handleAnswerSelect(qIndex, oIndex)}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${
                            quizAnswers[qIndex] === oIndex ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                          } ${
                            quizSubmitted ? (
                              oIndex === question.correctAnswer 
                                ? 'border-green-500 bg-green-50'
                                : quizAnswers[qIndex] === oIndex 
                                  ? 'border-red-500 bg-red-50'
                                  : ''
                            ) : ''
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              quizAnswers[qIndex] === oIndex ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
                            } ${
                              quizSubmitted && oIndex === question.correctAnswer ? 'border-green-500 bg-green-500 text-white' : ''
                            }`}>
                              {quizAnswers[qIndex] === oIndex && !quizSubmitted && <Check className="h-3 w-3" />}
                              {quizSubmitted && oIndex === question.correctAnswer && <Check className="h-3 w-3" />}
                            </div>
                            <span>{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {!quizSubmitted && (
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={handleSubmitQuiz} 
                      disabled={quizAnswers.length < (module.quiz?.length || 0)}
                    >
                      <ClipboardCheck className="mr-2 h-4 w-4" />
                      Submit Quiz
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                No quiz available for this module.
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between border-t pt-4">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab(activeTab === 'content' ? 'quiz' : 'content')}
              disabled={(activeTab === 'quiz' && !module.quiz?.length)}
            >
              {activeTab === 'content' ? (
                <>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Go to Quiz
                </>
              ) : (
                <>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Content
                </>
              )}
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            {module.status !== 'completed' && (
              <Button onClick={handleCompleteModule}>
                Mark as Completed
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeModulePopup;
