import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIChatWidgetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant"; // Explicitly limited to these two values
  content: string;
  timestamp: Date;
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! I'm your AI coach. How can I assist you with your training today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  
  // Simulate AI typing and response generation
  const simulateAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let aiResponse = "";
    
    // Simple rule-based responses
    if (userMessage.toLowerCase().includes("help")) {
      aiResponse = "I can help you with training scenarios, answer questions about customer service techniques, or provide feedback on your past performance. What would you like assistance with?";
    } else if (userMessage.toLowerCase().includes("scenario")) {
      aiResponse = "We have several scenarios available for practice. The 'Flight Cancellation' scenario is recommended for beginners. Would you like to try it?";
    } else if (userMessage.toLowerCase().includes("progress")) {
      aiResponse = "You're making great progress! You've completed 65% of your current level. Keep practicing the de-escalation techniques to improve further.";
    } else if (userMessage.toLowerCase().includes("badge")) {
      aiResponse = "You currently have 8 badges. To earn the 'Knowledge Master' badge, you'll need to read all the basic knowledge articles.";
    } else {
      aiResponse = "That's an interesting question. I'd recommend practicing with more scenarios to improve in that area. Is there a specific skill you'd like to focus on?";
    }
    
    setIsTyping(false);
    
    // Add AI response to messages - Fix the type of 'role' to be "assistant" explicitly
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString() + "-ai",
        role: "assistant" as const,  // Explicitly type this as "assistant"
        content: aiResponse,
        timestamp: new Date(),
      },
    ]);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message - Fix the type of 'role' to be "user" explicitly
    const userMessage: ChatMessage = {
      id: Date.now().toString() + "-user",
      role: "user",  // This is already correctly typed
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input field
    setInput("");
    
    // Generate AI response
    simulateAIResponse(input);
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);
  
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
              <div className="bg-brand-blue text-white p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 3C16.9706 3 21 6.80558 21 11.5C21 16.1944 16.9706 20 12 20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 3C7.02944 3 3 6.80558 3 11.5C3 12.93 3.51314 14.6699 4.39448 16.0837L3 20L7.25464 18.7917C8.6395 19.5575 10.2686 20 12 20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9 8.5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M7.5 15.5H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">AI Coach</h3>
                    <p className="text-xs opacity-80">Here to help with your training</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white"
                  aria-label="Close chat"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              
              {/* Messages area */}
              <ScrollArea className="h-80 p-3 pt-4 bg-gray-50">
                <div className="flex flex-col gap-3">
                  {messages.map(message => (
                    <motion.div
                      key={message.id}
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
                  ))}
                  
                  {/* AI is typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="rounded-lg px-4 py-2 bg-white border border-gray-200">
                        <div className="flex gap-1 items-center">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Invisible element to scroll to */}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input area */}
              <form onSubmit={handleSubmit} className="p-3 bg-white border-t">
                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Ask your AI coach..."
                    className="flex-1 border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
                    rows={1}
                  />
                  <Button type="submit" className="bg-brand-blue hover:bg-brand-blue-dark">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22 2L11 13"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 2L15 22L11 13L2 9L22 2Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
