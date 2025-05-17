
import { motion } from "framer-motion";

const ChatTypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="rounded-lg px-4 py-2 bg-white border border-gray-200">
        <div className="flex gap-1 items-center">
          <motion.div 
            className="w-2 h-2 rounded-full bg-gray-400" 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatTypingIndicator;
