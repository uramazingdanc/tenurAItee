
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CallScenario } from "@/services/callScenarioService";

interface ScenarioSelectionProps {
  scenarios: CallScenario[];
  onSelectScenario: (scenario: CallScenario) => void;
}

const ScenarioSelection = ({ scenarios, onSelectScenario }: ScenarioSelectionProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {scenarios.map((scenario) => (
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
