
export interface KnowledgeArticle {
  id: string;
  title: string;
  excerpt: string;
  url: string;
}

export interface ChatSuggestion {
  id: string;
  text: string;
}

export interface AICoachResponse {
  message: string;
  suggestions?: ChatSuggestion[];
  knowledgeArticles?: KnowledgeArticle[];
  sessionId?: string;
}
