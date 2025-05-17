
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "@/components/ui/motion";

interface DashboardWelcomeHeaderProps {
  greeting: string;
  userName: string;
  lastActive: string;
  userLevel: number;
  streak: number;
  userTitle: string;
  userAvatar?: string;
}

const getTimeIcon = (): string => {
  const hour = new Date().getHours();
  if (hour < 6) return "🌙"; // Night
  if (hour < 12) return "🌅"; // Morning
  if (hour < 18) return "☀️"; // Afternoon
  return "🌆"; // Evening
};

const DashboardWelcomeHeader = ({
  greeting,
  userName,
  lastActive,
  userLevel,
  streak,
  userTitle,
  userAvatar
}: DashboardWelcomeHeaderProps) => {
  const timeIcon = getTimeIcon();
  const firstInitial = userName.charAt(0);
  
  // Random motivational quotes
  const quotes = [
    "Your empathy score is above team average - keep shining!",
    "Customers appreciate your attention to detail!",
    "You've resolved 12% more issues than last week!",
    "Your communication skills make a difference every day.",
    "Keep up the great work - you're making an impact!"
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <motion.div 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 md:mb-0"
          >
            <h1 className="text-2xl md:text-3xl font-bold">
              {timeIcon} {greeting}, <span className="text-blue-600">{userName}</span>!
              <div className="text-sm font-normal text-gray-500 mt-1">Last active: {lastActive}</div>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ x: 20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center"
          >
            <div className="mr-4 text-right hidden md:block">
              <p className="font-semibold">
                🏆 <span>{userTitle}</span>
              </p>
              {streak > 0 && (
                <p className="text-amber-500">
                  🔥 {streak}-day streak
                </p>
              )}
            </div>
            
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-blue-100">
                {userAvatar ? (
                  <AvatarImage src={userAvatar} alt={userName} />
                ) : (
                  <AvatarFallback className="bg-blue-600 text-white">
                    {firstInitial}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <Badge className="absolute -top-2 -right-2 bg-blue-500">
                Lvl {userLevel}
              </Badge>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100 text-blue-700 text-sm"
        >
          <span className="font-medium">💡 </span>
          {randomQuote}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardWelcomeHeader;
