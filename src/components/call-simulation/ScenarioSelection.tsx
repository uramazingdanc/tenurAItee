
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CallScenario } from "@/services/callScenarioService";
import { useQuery } from "@tanstack/react-query";
import { fetchScenarios, getScenarioDuration } from "@/services/scenarioService";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Unlock } from "lucide-react";

interface ScenarioSelectionProps {
  scenarios: CallScenario[];
  onSelectScenario: (scenario: CallScenario) => void;
  unlockedScenarioIds?: string[];
}

const ScenarioSelection = ({ 
  scenarios, 
  onSelectScenario,
  unlockedScenarioIds = ["flightCancellation"] // First scenario is always unlocked by default
}: ScenarioSelectionProps) => {
  const { user } = useAuth();
  const { data: backendScenarios, isLoading } = useQuery({
    queryKey: ['scenarios', user?.id],
    queryFn: () => fetchScenarios(false), // Not fetching premium scenarios by default
    enabled: !!user, // Only fetch if user is authenticated
  });

  // If backend scenarios are loaded, use them instead of the hardcoded ones
  const displayScenarios = backendScenarios?.length ? backendScenarios.map(s => ({
    ...s,
    steps: scenarios.find(hs => hs.title === s.title)?.steps || [{
      id: 1,
      speaker: "Customer",
      message: "Hello, I need assistance with my request.",
      emotion: "neutral"
    }],
    duration: getScenarioDuration(s.title),
    unlocked: unlockedScenarioIds.includes(s.id)
  })) : scenarios.map(s => ({
    ...s,
    unlocked: unlockedScenarioIds.includes(s.id)
  }));

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="cursor-pointer">
            <CardHeader>
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {displayScenarios.map((scenario) => (
        <Card 
          key={scenario.id} 
          className={`transition-all ${
            scenario.unlocked 
              ? "cursor-pointer hover:shadow-md" 
              : "opacity-70 cursor-not-allowed"
          }`}
          onClick={() => scenario.unlocked ? onSelectScenario(scenario) : null}
        >
          <CardHeader className="bg-gradient-to-r from-brand-blue/10 to-brand-green/10 border-b">
            <div className="flex justify-between items-start">
              <CardTitle>{scenario.title}</CardTitle>
              {scenario.unlocked ? (
                <Unlock className="h-4 w-4 text-green-500" />
              ) : (
                <Lock className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <CardDescription>{scenario.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <Badge className={
                scenario.difficulty === "Beginner" 
                  ? "bg-green-500" 
                  : scenario.difficulty === "Intermediate" 
                    ? "bg-brand-blue" 
                    : "bg-purple-600"
              }>
                {scenario.difficulty}
              </Badge>
              <span className="text-sm text-gray-500">{scenario.duration} min</span>
            </div>
            {!scenario.unlocked && (
              <p className="text-xs text-gray-500 mt-2">
                Complete previous scenarios to unlock
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScenarioSelection;
