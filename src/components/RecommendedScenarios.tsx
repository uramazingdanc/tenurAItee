
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { Check, Square } from "lucide-react";
import { fetchScenarios } from "@/services/scenarioService";
import { Scenario } from "@/services/scenarioService";
import { Badge } from "@/components/ui/badge";

const RecommendedScenarios = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getScenarios = async () => {
      try {
        const data = await fetchScenarios();
        // Sort by difficulty to show beginner scenarios first
        const sortedScenarios = data.sort((a, b) => {
          const difficultyOrder = { 
            "Beginner": 1, 
            "Intermediate": 2, 
            "Advanced": 3 
          };
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
                 difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
        });
        setScenarios(sortedScenarios.slice(0, 3)); // Take top 3 recommended
      } catch (error) {
        console.error("Error fetching scenarios:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getScenarios();
  }, []);

  return (
    <div className="py-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Recommended For You</h2>
        <p className="text-sm text-gray-600">Based on your progress</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="h-24 bg-gray-100 animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {scenarios.map((scenario, index) => (
            <Link to={`/scenarios/${scenario.id}`} key={scenario.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-4 border hover:border-brand-blue hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex items-center justify-center rounded-md bg-green-50 mr-4">
                      <Square className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{scenario.title}</h3>
                      <p className="text-sm text-gray-600">
                        Practice scenario • {scenario.title.includes("Cancellation") ? "5" : "10"} min
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedScenarios;
