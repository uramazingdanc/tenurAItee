
import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XCircle, Loader2 } from "lucide-react";
import { SCENARIOS } from "@/services/callScenarioService";
import { useCallSimulation } from "@/hooks/useCallSimulation";
import ScenarioSelection from "./call-simulation/ScenarioSelection";
import ConversationInterface from "./call-simulation/ConversationInterface";
import FeedbackSection from "./call-simulation/FeedbackSection";
import ScoreDisplay from "./call-simulation/ScoreDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

const CallSimulation = () => {
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
      
      // Get the first available scenario
      const firstAvailableScenario = SCENARIOS.find(s => 
        unlockedScenarios.includes(s.id) || s.id === "flightCancellation"
      );
      
      if (firstAvailableScenario) {
        // Start the selected scenario
        startScenario(firstAvailableScenario);
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

  return (
    <section className="py-16 bg-white" id="simulation">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-gradient">
            Try a Mock Call Simulation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience our interactive call simulations powered by ElevenLabs voice technology and GPT-4o mini. Practice handling real customer scenarios.
          </p>
          
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
                "Start a Simulation"
              )}
            </Button>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {callStatus === 'selecting' && !isInitializing && (
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

                {callStatus === 'completed' && (
                  <FeedbackSection
                    feedbackMessage={feedbackMessage}
                    transcript={transcript}
                    onReset={resetSimulation}
                    scenarioId={selectedScenario.id}
                    averageScore={averageScore}
                    passThreshold={passThreshold}
                  />
                )}
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
