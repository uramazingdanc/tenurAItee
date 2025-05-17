
import { motion } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import UserProfileHeader from "./UserProfileHeader";
import { UserData } from "@/types/user";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  user: UserData | null;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const userName = user?.user_metadata?.full_name || 'John Smith';
  const userInitials = userName.split(' ').map(name => name[0]).join('') || 'JS';
  
  const handleSettingsClick = () => {
    navigate('/settings');
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <motion.h1 
          className="text-3xl font-bold heading-gradient"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Agent Dashboard
        </motion.h1>
        <motion.p 
          className="text-gray-500 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Track your progress and continue your training
        </motion.p>
      </div>
      <div className="mt-4 md:mt-0 flex items-center">
        <UserProfileHeader 
          userName={userName} 
          userInitials={userInitials}
          onProfileClick={() => navigate('/profile')} 
        />
        <Button variant="outline" onClick={handleSettingsClick}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
