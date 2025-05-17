
import { motion } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";

interface UserProfileHeaderProps {
  userName: string;
  userInitials: string;
}

const UserProfileHeader = ({ userName, userInitials }: UserProfileHeaderProps) => {
  return (
    <motion.div 
      className="bg-white border border-gray-200 rounded-md px-4 py-2 flex items-center mr-3"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-sm mr-3">
        {userInitials}
      </div>
      <span className="font-medium">{userName}</span>
    </motion.div>
  );
};

export default UserProfileHeader;
