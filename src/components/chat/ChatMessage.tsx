
import { motion } from "framer-motion";
import { ChatMessage as ChatMessageType } from "@/services/aiChatService";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <motion.div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={`rounded-lg px-3 py-2 max-w-[85%] ${
          message.role === "user"
            ? "bg-brand-blue text-white"
            : "bg-white border border-gray-200"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
