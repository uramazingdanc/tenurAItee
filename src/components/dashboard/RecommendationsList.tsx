
import { motion } from "@/components/ui/motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RecommendationItemProps {
  title: string;
  type: "video" | "article" | "practice";
  duration: string;
  icon: "play" | "document" | "practice";
}

const RecommendationsList = () => {
  const recommendations: RecommendationItemProps[] = [
    {
      title: "De-escalation Techniques",
      type: "video",
      duration: "8 min",
      icon: "play"
    },
    {
      title: "Travel Insurance FAQ",
      type: "article",
      duration: "5 min read",
      icon: "document"
    },
    {
      title: "Handling Refund Requests",
      type: "practice",
      duration: "",
      icon: "practice"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Recommended For You</CardTitle>
          <CardDescription>Based on your progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((item, index) => (
            <RecommendationItem key={index} index={index} {...item} />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const RecommendationItem = ({ title, type, duration, icon, index }: RecommendationItemProps & { index: number }) => {
  return (
    <motion.div
      key={index}
      className="border rounded-md p-3 hover:border-brand-blue hover:bg-brand-blue/5 cursor-pointer transition-colors"
      whileHover={{ scale: 1.02, x: 5 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + (index * 0.1), duration: 0.3 }}
    >
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded flex items-center justify-center mr-3 ${
          icon === "play" ? "bg-purple-100 text-purple-600" :
          icon === "document" ? "bg-blue-100 text-blue-600" :
          "bg-green-100 text-green-600"
        }`}>
          {icon === "play" && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17.5L16 12L9 6.5V17.5Z" fill="currentColor" />
            </svg>
          )}
          {icon === "document" && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M9 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          {icon === "practice" && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5H5V19H19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div>
          <h3 className="font-medium text-sm">{title}</h3>
          <p className="text-xs text-gray-500">
            {type === "video" && "Video • "}
            {type === "article" && "Article • "}
            {type === "practice" && "Practice scenario"}
            {duration}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationsList;
