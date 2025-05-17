
import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XCircle, Loader2, ArrowRight } from "lucide-react";
import { SCENARIOS } from "@/services/callScenarioService";
import { useCallSimulation } from "@/hooks/useCallSimulation";
import ScenarioSelection from "./call-simulation/ScenarioSelection";
import ConversationInterface from "./call-simulation/ConversationInterface";
import FeedbackSection from "./call-simulation/FeedbackSection";
import ScoreDisplay from "./call-simulation/ScoreDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

const CallSimulation = ({ isGuidedMode = false }) => {
  const {
    state,
    audioRef,
    startScenario,
    handleOptionClick,
    handlePlayPause,
    resetSimulation,
    getCurrentCustomerMessage,
    getResponseOptions
  } = useCallSimulation();
  
  const { user } = useAuth();
  const [isInitializing, setIsInitializing] = useState(false);
  const [currentGuidedScenarioIndex, setCurrentGuidedScenarioIndex] = useState(0);

  const { 
    isPlaying, 
    currentStep, 
    transcript, 
    isLoading, 
    selectedScenario, 
    callStatus, 
    feedbackMessage,
    currentScore,
    averageScore,
    passThreshold,
    unlockedScenarios
  } = state;

  // Define guided scenarios in order of progression
  const guidedScenarios = [
    SCENARIOS.find(s => s.id === "flightCancellation"),
    SCENARIOS.find(s => s.id === "bookingModification"),
    SCENARIOS.find(s => s.id === "refundRequest")
  ].filter(Boolean);

  // Function to handle the "Try a Mock Call Simulation" CTA click
  const handleTrySimulationClick = async () => {
    // Show initializing state
    setIsInitializing(true);
    
    // Simulate backend prep (as described in the spec)
    toast.info("Preparing simulation...", {
      description: "Setting up your personalized scenario"
    });
    
    try {
      // Mock the API calls described in the spec
      console.log("Simulating API calls:");
      console.log("1. GET user's progress");
      console.log("2. Select appropriate scenario");
      console.log("3. Generate voice profile");
      
      // Wait a bit to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let targetScenario;
      
      if (isGuidedMode) {
        // In guided mode, select scenario based on progression
        targetScenario = guidedScenarios[currentGuidedScenarioIndex];
      } else {
        // Regular mode - get first available scenario
        targetScenario = SCENARIOS.find(s => 
          unlockedScenarios.includes(s.id) || s.id === "flightCancellation"
        );
      }
      
      if (targetScenario) {
        // Start the selected scenario
        startScenario(targetScenario);
      } else {
        toast.error("No scenarios available", {
          description: "Please try again later"
        });
      }
    } catch (error) {
      console.error("Error initializing simulation:", error);
      toast.error("Failed to initialize simulation", {
        description: "Please try again"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Handle scenario completion in guided mode
  const handleGuidedCompletion = () => {
    if (isGuidedMode && currentGuidedScenarioIndex < guidedScenarios.length - 1) {
      toast.success("Great job! Ready for the next level?", {
        description: "You're making excellent progress. Let's try something a bit more challenging.",
        action: {
          label: "Continue",
          onClick: () => {
            setCurrentGuidedScenarioIndex(prev => prev + 1);
            resetSimulation();
            setTimeout(() => {
              if (guidedScenarios[currentGuidedScenarioIndex + 1]) {
                startScenario(guidedScenarios[currentGuidedScenarioIndex + 1]);
              }
            }, 500);
          }
        }
      });
    } else if (isGuidedMode) {
      // Completed all guided scenarios
      toast.success("Congratulations! You've completed all guided scenarios!", {
        description: "You can now tackle any customer inquiry with confidence.",
      });
    }
  };

  // Extend FeedbackSection to include guided progression
  const renderFeedbackSection = () => {
    if (callStatus !== 'completed') return null;
    
    return (
      <div>
        <FeedbackSection
          feedbackMessage={feedbackMessage}
          transcript={transcript}
          onReset={isGuidedMode ? handleGuidedCompletion : resetSimulation}
          scenarioId={selectedScenario?.id}
          averageScore={averageScore}
          passThreshold={passThreshold}
        />
        
        {isGuidedMode && currentGuidedScenarioIndex < guidedScenarios.length - 1 && (
          <div className="mt-4 flex justify-end">
            <Button 
              className="bg-brand-blue hover:bg-brand-blue-dark"
              onClick={() => {
                setCurrentGuidedScenarioIndex(prev => prev + 1);
                resetSimulation();
                setTimeout(() => {
                  if (guidedScenarios[currentGuidedScenarioIndex + 1]) {
                    startScenario(guidedScenarios[currentGuidedScenarioIndex + 1]);
                  }
                }, 500);
              }}
            >
              Continue to Next Scenario <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 bg-white" id="simulation">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-gradient">
            {isGuidedMode ? "Guided Call Simulation" : "Try a Mock Call Simulation"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isGuidedMode 
              ? "Follow step-by-step guidance from basic to intermediate scenarios. Perfect your skills in a structured learning path."
              : "Experience our interactive call simulations powered by ElevenLabs voice technology and GPT-4o mini. Practice handling real customer scenarios."}
          </p>
          
          {/* Progress indicator for guided mode */}
          {isGuidedMode && guidedScenarios.length > 0 && (
            <div className="flex justify-center mt-4 mb-6">
              <div className="flex items-center">
                {guidedScenarios.map((scenario, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`rounded-full w-3 h-3 ${
                      index <= currentGuidedScenarioIndex 
                        ? "bg-brand-blue" 
                        : "bg-gray-300"
                    }`}></div>
                    {index < guidedScenarios.length - 1 && (
                      <div className={`w-10 h-0.5 ${
                        index < currentGuidedScenarioIndex 
                          ? "bg-brand-blue" 
                          : "bg-gray-300"
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* CTA button only shown when no scenario is selected */}
          {callStatus === 'selecting' && (
            <Button 
              size="lg" 
              className="mt-6 bg-brand-blue hover:bg-brand-blue-dark"
              onClick={handleTrySimulationClick}
              disabled={isInitializing}
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Simulation...
                </>
              ) : (
                isGuidedMode ? "Start Guided Learning" : "Start a Simulation"
              )}
            </Button>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {callStatus === 'selecting' && !isInitializing && !isGuidedMode && (
            <ScenarioSelection 
              scenarios={SCENARIOS}
              onSelectScenario={startScenario}
              unlockedScenarioIds={unlockedScenarios}
            />
          )}

          {callStatus !== 'selecting' && selectedScenario && (
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-brand-blue/10 to-brand-green/10 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedScenario.title}</CardTitle>
                    <CardDescription>{selectedScenario.description}</CardDescription>
                  </div>
                  <Badge className={
                    selectedScenario.difficulty === "Beginner" 
                      ? "bg-green-500" 
                      : selectedScenario.difficulty === "Intermediate" 
                        ? "bg-brand-blue" 
                        : "bg-purple-600"
                  }>
                    {selectedScenario.difficulty}
                  </Badge>
                </div>
                
                {callStatus === 'in-progress' && averageScore !== null && (
                  <ScoreDisplay 
                    currentScore={currentScore} 
                    averageScore={averageScore} 
                    passThreshold={passThreshold || 70}
                  />
                )}
              </CardHeader>
              <CardContent className="pt-6">
                {callStatus === 'in-progress' && (
                  <ConversationInterface
                    currentCustomerMessage={getCurrentCustomerMessage()}
                    isPlaying={isPlaying}
                    isLoading={isLoading}
                    responseOptions={getResponseOptions()}
                    onPlayPause={handlePlayPause}
                    onSelectResponse={handleOptionClick}
                    audioRef={audioRef}
                  />
                )}

                {callStatus === 'completed' && renderFeedbackSection()}
              </CardContent>

              {callStatus === 'in-progress' && (
                <CardFooter className="bg-gray-50 flex justify-between">
                  <div className="text-sm text-gray-500">
                    Step {currentStep} of 6
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetSimulation}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    End Call
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallSimulation;
