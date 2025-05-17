
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChatMessage as ChatMessageType, 
  sendChatMessage, 
  getStoredConversation, 
  storeConversation,
  getStoredSessionId,
  storeSessionId
} from "@/services/aiChatService";
import { KnowledgeArticle, ChatSuggestion } from "@/types/chat";

// Import our components
import ChatMessage from "@/components/chat/ChatMessage";
import ChatTypingIndicator from "@/components/chat/ChatTypingIndicator";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";

interface AIChatWidgetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>([]);
  const [suggestions, setSuggestions] = useState<ChatSuggestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Load conversation history and session from storage when user loads or changes
  useEffect(() => {
    if (user?.id) {
      const storedMessages = getStoredConversation(user.id);
      setMessages(storedMessages);
      
      const storedSessionId = getStoredSessionId(user.id);
      setSessionId(storedSessionId);
    }
  }, [user?.id]);
  
  // Store conversation whenever messages change
  useEffect(() => {
    if (user?.id && messages.length > 0) {
      storeConversation(user.id, messages);
    }
  }, [messages, user?.id]);
  
  // Store session ID whenever it changes
  useEffect(() => {
    if (user?.id && sessionId) {
      storeSessionId(user.id, sessionId);
    }
  }, [sessionId, user?.id]);
  
  // Handle getting AI response from backend
  const handleGetAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      const aiResponse = await sendChatMessage(userMessage, messages, sessionId);
      
      // Add AI response to messages
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + "-ai",
          role: "assistant",
          content: aiResponse.message,
          timestamp: new Date(),
        },
      ]);
      
      // Store any updated session ID
      if (aiResponse.sessionId && user?.id) {
        setSessionId(aiResponse.sessionId);
      }
      
      // Update knowledge articles and suggestions
      if (aiResponse.knowledgeArticles) {
        setKnowledgeArticles(aiResponse.knowledgeArticles);
      }
      
      if (aiResponse.suggestions) {
        setSuggestions(aiResponse.suggestions);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + "-error",
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = (message: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: Date.now().toString() + "-user",
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Clear any previous KB articles and suggestions when user sends a message
    setKnowledgeArticles([]);
    setSuggestions([]);
    
    // Generate AI response
    handleGetAIResponse(message);
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit(suggestion);
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);
  
  return (
    <>
      {/* Chat toggle button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-12 h-12 rounded-full shadow-lg ${
            isOpen ? "bg-red-500 hover:bg-red-600" : "bg-brand-blue hover:bg-brand-blue-dark"
          }`}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 11.5C21 16.1944 16.9706 20 12 20C10.2686 20 8.6395 19.5575 7.25464 18.7917L3 20L4.39448 16.0837C3.51314 14.6699 3 12.93 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 21 6.80558 21 11.5Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </Button>
      </motion.div>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 z-40 w-80 sm:w-96 max-w-full"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border shadow-xl overflow-hidden">
              {/* Chat header */}
              <ChatHeader onClose={() => setIsOpen(false)} />
              
              {/* Messages area */}
              <ScrollArea className="h-80 p-3 pt-4 bg-gray-50">
                <div className="flex flex-col gap-3">
                  {messages.map((message, index) => (
                    <ChatMessage 
                      key={message.id} 
                      message={message} 
                      knowledgeArticles={
                        // Only show knowledge articles for the last assistant message
                        message.role === "assistant" && 
                        index === messages.length - 1 && 
                        knowledgeArticles.length > 0 
                          ? knowledgeArticles 
                          : undefined
                      }
                    />
                  ))}
                  
                  {/* AI is typing indicator */}
                  {isTyping && <ChatTypingIndicator />}
                  
                  {/* Suggestions if available */}
                  {!isTyping && suggestions && suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full transition-colors"
                          onClick={() => handleSuggestionClick(suggestion.text)}
                        >
                          {suggestion.text}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Invisible element to scroll to */}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input area */}
              <ChatInput onSend={handleSubmit} disabled={isTyping} />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
