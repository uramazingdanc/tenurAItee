
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CallScenario } from "@/services/callScenarioService";
import { useQuery } from "@tanstack/react-query";
import { fetchScenarios } from "@/services/scenarioService";
import { useAuth } from "@/contexts/AuthContext";

interface ScenarioSelectionProps {
  scenarios: CallScenario[];
  onSelectScenario: (scenario: CallScenario) => void;
}

const ScenarioSelection = ({ scenarios, onSelectScenario }: ScenarioSelectionProps) => {
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
    duration: s.duration || scenarios.find(hs => hs.title === s.title)?.duration || 5,
  })) : scenarios;

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
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectScenario(scenario)}
        >
          <CardHeader className="bg-gradient-to-r from-brand-blue/10 to-brand-green/10 border-b">
            <CardTitle>{scenario.title}</CardTitle>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScenarioSelection;
