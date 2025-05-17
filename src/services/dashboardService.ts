
import { supabase } from '@/integrations/supabase/client';
import { UserStats } from '@/types/scenario';

export interface AgentProgressData {
  level: number;
  currentXp: number;
  requiredXp: number;
  totalXp: number;
  streak: number;
  nextReward: string;
}

export interface AgentStats extends UserStats {
  avgRating: number;
  scenariosCompleted: number;
  badgesEarned: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earned_at?: string;
  unlocked: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  is_premium?: boolean;
  completion?: number;
  status: "completed" | "in-progress" | "locked";
}

export interface AgentPerformance {
  customer_satisfaction: number;
  response_accuracy: number;
  issue_resolution_rate: number;
  improvement_areas: Array<{ category: string, title: string }>;
  period_start: string;
  period_end: string;
}

export interface Recommendation {
  type: "video" | "article" | "practice";
  title: string;
  duration?: string;
  url: string;
}

export interface DashboardData {
  progress: AgentProgressData;
  stats: AgentStats;
  achievements: Achievement[];
  scenarios: {
    completed: Scenario[];
    inProgress: Scenario[];
  };
  performance: AgentPerformance;
  recommendations: Recommendation[];
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    // Call our agent-progress edge function
    const { data, error } = await supabase.functions.invoke('agent-progress', {
      method: 'GET'
    });
    
    if (error) throw error;
    return data as DashboardData;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    
    // Return placeholder data if the API call fails
    return {
      progress: {
        level: 3,
        currentXp: 2500,
        requiredXp: 5000,
        totalXp: 7500,
        streak: 5,
        nextReward: "500 XP"
      },
      stats: {
        scenariosCompleted: 12,
        badgesEarned: 8,
        avgRating: 4.8
      },
      achievements: [
        {
          id: "1",
          name: "First Call",
          description: "Completed your first call scenario",
          icon: "🎯",
          category: "scenarios",
          unlocked: true
        },
        {
          id: "2",
          name: "Problem Solver",
          description: "Successfully resolved 5 customer issues",
          icon: "🔍",
          category: "performance",
          unlocked: true
        },
        {
          id: "3",
          name: "De-escalation Pro",
          description: "Calmed 3 upset customers",
          icon: "😌",
          category: "skills",
          unlocked: true
        },
        {
          id: "4",
          name: "Knowledge Master",
          description: "Read all basic knowledge articles",
          icon: "📚",
          category: "knowledge",
          unlocked: false
        }
      ],
      scenarios: {
        completed: [
          {
            id: "1",
            title: "Flight Cancellation",
            description: "Handle a customer requesting a flight cancellation due to emergency",
            difficulty: "Beginner",
            category: "Cancellations",
            status: "completed"
          }
        ],
        inProgress: [
          {
            id: "2",
            title: "Booking Modification",
            description: "Help customer change travel dates and accommodate special requests",
            difficulty: "Intermediate",
            category: "Modifications",
            status: "in-progress",
            completion: 75
          }
        ]
      },
      performance: {
        customer_satisfaction: 92,
        response_accuracy: 87,
        issue_resolution_rate: 78,
        improvement_areas: [
          { category: "skill", title: "Handling multiple requests at once" },
          { category: "knowledge", title: "Policy explanation clarity" }
        ],
        period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        period_end: new Date().toISOString()
      },
      recommendations: [
        {
          type: "video",
          title: "De-escalation Techniques",
          duration: "8 min",
          url: "/learning/de-escalation"
        },
        {
          type: "article",
          title: "Travel Insurance FAQ",
          duration: "5 min read",
          url: "/knowledge/travel-insurance-faq"
        },
        {
          type: "practice",
          title: "Handling Refund Requests",
          url: "/scenarios/refund-handling"
        }
      ]
    };
  }
};

export const completeScenario = async (scenarioId: string, score: number): Promise<{ success: boolean, xpGained: number }> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-progress/complete', {
      method: 'POST',
      body: { scenarioId, score }
    });
    
    if (error) throw error;
    return data as { success: boolean, xpGained: number };
  } catch (error) {
    console.error("Error completing scenario:", error);
    throw error;
  }
};

export const fetchAgentPerformance = async (): Promise<AgentPerformance> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-progress/performance', {
      method: 'GET'
    });
    
    if (error) throw error;
    return data as AgentPerformance;
  } catch (error) {
    console.error("Error fetching agent performance:", error);
    throw error;
  }
};

export const fetchUserAchievements = async (): Promise<Achievement[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-progress/achievements', {
      method: 'GET'
    });
    
    if (error) throw error;
    return data as Achievement[];
  } catch (error) {
    console.error("Error fetching achievements:", error);
    throw error;
  }
};

// Mock AI coaching API function to be replaced with actual AI coaching later
export const getAICoachingSuggestion = async (): Promise<string> => {
  const suggestions = [
    "Try practicing the de-escalation techniques in our 'Angry Customer' scenario.",
    "I noticed you've been excelling at refund scenarios. Ready for a more advanced challenge?",
    "Your customer satisfaction scores are improving! Keep working on clear policy explanations.",
    "You're on a 5-day streak! Complete one more scenario today to keep it going."
  ];
  
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};
