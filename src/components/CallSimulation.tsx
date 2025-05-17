
import { useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { SCENARIOS } from "@/services/callScenarioService";
import { useCallSimulation } from "@/hooks/useCallSimulation";
import ScenarioSelection from "./call-simulation/ScenarioSelection";
import ConversationInterface from "./call-simulation/ConversationInterface";
import FeedbackSection from "./call-simulation/FeedbackSection";

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

  const { 
    isPlaying, 
    currentStep, 
    transcript, 
    isLoading, 
    selectedScenario, 
    callStatus, 
    feedbackMessage 
  } = state;

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
        </div>

        <div className="max-w-4xl mx-auto">
          {callStatus === 'selecting' && (
            <ScenarioSelection 
              scenarios={SCENARIOS}
              onSelectScenario={startScenario}
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
