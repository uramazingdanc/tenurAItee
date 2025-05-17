
import { motion } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface AchievementItemProps {
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const AchievementsList = () => {
  const achievements: AchievementItemProps[] = [
    {
      name: "First Call",
      description: "Completed your first call scenario",
      icon: "🎯",
      unlocked: true
    },
    {
      name: "Problem Solver",
      description: "Successfully resolved 5 customer issues",
      icon: "🔍",
      unlocked: true
    },
    {
      name: "De-escalation Pro",
      description: "Calmed 3 upset customers",
      icon: "😌",
      unlocked: true
    },
    {
      name: "Knowledge Master",
      description: "Read all basic knowledge articles",
      icon: "📚",
      unlocked: false
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {achievements.map((badge, index) => (
        <AchievementItem key={index} index={index} {...badge} />
      ))}
    </div>
  );
};

const AchievementItem = ({ name, description, icon, unlocked, index }: AchievementItemProps & { index: number }) => {
  return (
    <motion.div
      key={index}
      whileHover={unlocked ? { scale: 1.05, y: -5 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card className={`text-center p-4 ${!unlocked && "opacity-50 grayscale"}`}>
        <div className="text-4xl mb-2">{icon}</div>
        <h4 className="font-medium">{name}</h4>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
        {!unlocked && (
          <Badge variant="outline" className="mt-2 mx-auto">Locked</Badge>
        )}
      </Card>
    </motion.div>
  );
};

export default AchievementsList;
