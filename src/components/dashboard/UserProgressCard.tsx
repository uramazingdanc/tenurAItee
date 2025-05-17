
import { motion } from "@/components/ui/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentProgressData } from "@/services/dashboardService";

interface UserProgressCardProps {
  label: string;
  value: number | string;
  icon: string;
  suffix?: string;
}

const UserProgressCard = ({ label, value, icon, suffix = "" }: UserProgressCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>{label}</span>
            <motion.div 
              className="bg-brand-blue text-white rounded-full w-10 h-10 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
            >
              {icon}
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-3xl font-bold">
            {value}{suffix}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProgressCard;
