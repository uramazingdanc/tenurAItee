
import { Progress } from "@/components/ui/progress";

interface ScoreDisplayProps {
  currentScore: number | null;
  averageScore: number;
  passThreshold: number;
}

const ScoreDisplay = ({ currentScore, averageScore, passThreshold }: ScoreDisplayProps) => {
  return (
    <div className="mt-4 bg-white/90 rounded-lg p-3 border shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-sm text-gray-700">Agent Performance</h4>
        <div className="flex items-center gap-2">
          {currentScore !== null && (
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              currentScore >= 80 ? "bg-green-100 text-green-800" : 
              currentScore >= 60 ? "bg-blue-100 text-blue-800" :
              "bg-red-100 text-red-800"
            }`}>
              Last: {currentScore}%
            </div>
          )}
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            averageScore >= passThreshold ? "bg-green-100 text-green-800" : 
            "bg-orange-100 text-orange-800"
          }`}>
            Average: {averageScore}%
          </div>
        </div>
      </div>
      
      <div className="w-full">
        <Progress 
          value={averageScore} 
          max={100}
          className="h-2" 
        />
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>0%</span>
          <span className="text-brand-blue font-medium">
            Pass: {passThreshold}%
          </span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
