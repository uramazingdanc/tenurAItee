
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  kb_articles?: {
    id: string;
    title: string;
    excerpt: string;
    url: string;
  }[];
}

export const sendChatMessage = async (
  message: string, 
  conversationHistory: ChatMessage[]
): Promise<AIResponse> => {
  try {
    // Send message to our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        message,
        history: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }
    });

    if (error) throw error;

    return {
      message: data.response,
      suggestions: data.suggestions,
      kb_articles: data.kb_articles
    };
  } catch (error) {
    console.error("Error sending chat message:", error);
    return {
      message: "I'm having trouble connecting to the AI. Please try again in a moment."
    };
  }
};

// Get conversation history from local storage or create new
export const getStoredConversation = (userId: string): ChatMessage[] => {
  const storedConversation = localStorage.getItem(`chat_history_${userId}`);
  
  if (storedConversation) {
    try {
      const parsed = JSON.parse(storedConversation);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (e) {
      console.error("Error parsing stored conversation:", e);
      return getDefaultWelcomeMessage();
    }
  }
  
  return getDefaultWelcomeMessage();
};

// Store conversation in local storage
export const storeConversation = (userId: string, messages: ChatMessage[]): void => {
  localStorage.setItem(`chat_history_${userId}`, JSON.stringify(messages));
};

// Default welcome message
const getDefaultWelcomeMessage = (): ChatMessage[] => {
  return [{
    id: "welcome",
    role: "assistant",
    content: "Hi there! I'm your AI coach. How can I assist you with your training today?",
    timestamp: new Date()
  }];
};
