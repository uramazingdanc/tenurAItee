
import { motion } from "@/components/ui/motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserProfileHeaderProps {
  userName: string;
  userInitials: string;
  onProfileClick?: () => void;
}

const UserProfileHeader = ({ userName, userInitials, onProfileClick }: UserProfileHeaderProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div 
            className="bg-white border border-gray-200 rounded-md px-4 py-2 flex items-center mr-3 cursor-pointer hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={onProfileClick}
            data-testid="user-profile-header"
          >
            <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-sm mr-3">
              {userInitials}
            </div>
            <span className="font-medium">{userName}</span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>View and edit your profile</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserProfileHeader;
