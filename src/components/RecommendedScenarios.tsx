
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { Square } from "lucide-react";
import { SCENARIOS } from "@/services/callScenarioService";

const RecommendedScenarios = () => {
  const [isLoading, setIsLoading] = useState(false);

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
          {SCENARIOS.map((scenario, index) => (
            <Link to={`#simulation`} key={scenario.id}>
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
                        Practice scenario • {scenario.duration} min
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
