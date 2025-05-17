
import { motion } from "framer-motion";
import { ChatMessage as ChatMessageType } from "@/services/aiChatService";
import { KnowledgeArticle } from "@/types/chat";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
  knowledgeArticles?: KnowledgeArticle[];
}

const ChatMessage = ({ message, knowledgeArticles }: ChatMessageProps) => {
  return (
    <motion.div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-[85%]">
        <div
          className={`rounded-lg px-3 py-2 ${
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
        
        {/* Knowledge Articles Section */}
        {message.role === "assistant" && knowledgeArticles && knowledgeArticles.length > 0 && (
          <div className="mt-2 space-y-2">
            {knowledgeArticles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-blue-50 border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-sm font-medium flex items-center">
                          <span className="mr-1">📄</span> {article.title}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1 line-clamp-2">
                          {article.excerpt}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="ml-2 shrink-0">
                        <ExternalLink className="h-3 w-3 mr-1" /> KB
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
