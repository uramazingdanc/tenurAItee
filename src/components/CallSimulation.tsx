
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const CallSimulation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);

  const simulationSteps = [
    {
      speaker: "Customer",
      message: "Hi, I need to cancel my flight booking for next week due to a family emergency. Can you help me with that?",
      options: [
        "Sure, I can help you with that. Can you provide me with your booking reference?",
        "I'm sorry to hear that. Let me check what options we have for you.",
        "We don't offer refunds for cancellations. You'll have to pay a fee."
      ]
    },
    {
      speaker: "Customer",
      message: "My booking reference is ABC123. I booked a round trip from New York to London departing on July 15th.",
      options: [
        "I've found your booking. I see there's a $200 cancellation fee for this fare type.",
        "Thank you for providing that information. Let me check our cancellation policy for this booking.",
        "I can cancel that for you now and process the refund to your original payment method."
      ]
    },
    {
      speaker: "Customer",
      message: "That's fine. I understand there might be a cancellation fee. Can you tell me how much I'll get refunded?",
      options: [
        "After the cancellation fee, you'll receive $450 back to your original payment method.",
        "Let me calculate that for you now.",
        "You won't get much back because of our cancellation policy."
      ]
    }
  ];

  const handleOptionClick = (option: string) => {
    setResponses([...responses, option]);
    if (currentStep < simulationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Simulation complete
      console.log("Simulation complete");
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="py-16 bg-white" id="simulation">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-gradient">
            Try a Mock Call Simulation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience our interactive call simulations powered by ElevenLabs voice technology. Practice handling real customer scenarios.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-brand-blue/10 to-brand-green/10 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Flight Cancellation Scenario</CardTitle>
                  <CardDescription>Customer seeking to cancel a flight booking</CardDescription>
                </div>
                <Badge className="bg-brand-blue">Beginner</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-xl relative">
                  {isPlaying && (
                    <div className="absolute -right-1 -top-1 w-4 h-4 bg-red-500 rounded-full pulse-light"></div>
                  )}
                  C
                </div>
                <div className="ml-4">
                  <div className="font-medium">Customer</div>
                  <div className="text-gray-500 text-sm">John Smith</div>
                </div>
                <div className="ml-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex items-center ${isPlaying ? 'border-red-500 text-red-500' : ''}`}
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <rect x="6" y="4" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                          <rect x="14" y="4" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                        </svg>
                        Pause Audio
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <polygon points="5,3 19,12 5,21" fill="currentColor" />
                        </svg>
                        Play Audio
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <p className="text-gray-700">
                  {simulationSteps[currentStep].message}
                </p>
              </div>

              <Separator className="my-6" />

              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-3">Choose your response:</h4>
                <div className="space-y-3">
                  {simulationSteps[currentStep].options.map((option, index) => (
                    <div 
                      key={index}
                      className="p-3 border rounded-lg hover:bg-brand-blue/5 hover:border-brand-blue cursor-pointer transition-colors"
                      onClick={() => handleOptionClick(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 flex justify-between">
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {simulationSteps.length}
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-medium">AI Feedback Ready</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CallSimulation;
