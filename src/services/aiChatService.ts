
import { supabase } from '@/integrations/supabase/client';
import { AICoachResponse, ChatSuggestion, KnowledgeArticle } from '@/types/chat';

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const sendChatMessage = async (
  message: string, 
  conversationHistory: ChatMessage[],
  sessionId?: string
): Promise<AICoachResponse> => {
  try {
    // Prepare conversation history in the format expected by the API
    const formattedHistory = conversationHistory
      .slice(-8) // Only send the last 8 messages to avoid token limits
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));

    // Send message to our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('enhanced-ai-chat', {
      body: {
        message,
        history: formattedHistory,
        sessionId
      }
    });

    if (error) throw error;

    // Format the suggestions as ChatSuggestion objects
    const formattedSuggestions = data.suggestions 
      ? data.suggestions.map((text: string, index: number) => ({
          id: `sugg_${index}`,
          text
        }))
      : undefined;

    return {
      message: data.response,
      suggestions: formattedSuggestions,
      knowledgeArticles: data.kb_articles,
      sessionId: data.sessionId
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

// Get session ID from local storage or create new
export const getStoredSessionId = (userId: string): string => {
  const storedSessionId = localStorage.getItem(`chat_session_${userId}`);
  if (storedSessionId) return storedSessionId;
  
  const newSessionId = crypto.randomUUID();
  localStorage.setItem(`chat_session_${userId}`, newSessionId);
  return newSessionId;
};

// Store session ID in local storage
export const storeSessionId = (userId: string, sessionId: string): void => {
  localStorage.setItem(`chat_session_${userId}`, sessionId);
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
