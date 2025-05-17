
import { supabase } from '@/integrations/supabase/client';

export type KnowledgeModule = {
  id: string;
  name: string;
  description: string;
  status: 'locked' | 'in-progress' | 'completed';
  content: string;
  icon?: string;
  actions?: {
    type: string;
    icon: string;
    label: string;
  }[];
  prerequisites?: string[];
};

// Mock data for now - in a real app this would come from the database
export const knowledgeModules: KnowledgeModule[] = [
  { 
    id: "basic_customer_service", 
    name: "Basic Customer Service", 
    description: "Learn the fundamentals of customer service",
    status: "in-progress",
    content: `**Core Principles**  
✅ The 3 A's: Acknowledge, Apologize, Act  
✅ Active listening techniques  
✅ Professional tone & language  

**Key Scenarios**  
• Handling routine inquiries  
• Account management basics  
• Service etiquette  

**Pro Tip**  
> "Customers don't care what you know until they know you care."`,
    actions: [
      { type: "video", icon: "📚", label: "View Training Videos" },
      { type: "simulation", icon: "🛠", label: "Practice Scenario" }
    ]
  },
  { 
    id: "difficult_customers", 
    name: "Handling Difficult Customers", 
    description: "Techniques for de-escalation and resolution",
    status: "locked",
    content: `**De-escalation Framework**  
1. **L**isten without interrupting  
2. **E**mpathize explicitly  
3. **A**sk clarifying questions  
4. **R**espond with options  
5. **N**egotiate solution  

**Phrase Bank**  
• "I understand why that would be frustrating..."  
• "Let's explore how we can make this right..."  

⚠️ **Red Flags**  
- Raised voice patterns  
- Repeated issue mentions`,
    prerequisites: ["basic_customer_service"],
    actions: [
      { type: "audio", icon: "🎧", label: "Audio Examples" },
      { type: "guide", icon: "📝", label: "Roleplay Guide" }
    ]
  },
  { 
    id: "tech_support_basics", 
    name: "Technical Support Basics", 
    description: "Troubleshooting common issues",
    status: "locked",
    content: `**Troubleshooting Flowchart**  
Start → Identify symptoms → Check logs → Isolate variables → Test fix → Document  

**Common Issues**  
| Issue Type       | First-Line Fix          |
|------------------|-------------------------|
| Login failures   | Password reset portal   |
| Slow performance | Cache clearance script  |

**Toolkit**  
🔧 Remote desktop protocol  
🔧 Knowledge base search shortcuts`,
    prerequisites: ["difficult_customers"],
    actions: [
      { type: "lab", icon: "🖥️", label: "Interactive Lab" },
      { type: "quiz", icon: "🧩", label: "Diagnostic Quiz" }
    ]
  },
  { 
    id: "advanced_tech_support", 
    name: "Advanced Technical Support", 
    description: "Solving complex technical challenges",
    status: "locked",
    content: `**Complex Case Protocol**  
1. Replicate the issue  
2. Trace system dependencies  
3. Escalate with full context  

**Debugging Mindset**  
• Assume nothing, verify everything  
• Document every test iteration  

**Case Study**  
> "Resolved 14-hour outage by identifying race condition in payment API"`,
    prerequisites: ["tech_support_basics"],
    actions: [
      { type: "diagrams", icon: "📊", label: "System Diagrams" },
      { type: "ai", icon: "🤖", label: "AI Debugging Assistant" }
    ]
  },
  { 
    id: "leadership_skills", 
    name: "Leadership Skills", 
    description: "Mentoring and team support techniques",
    status: "locked",
    content: `**Coaching Framework**  
- **S**ituation → Behavior → **I**mpact feedback  
- GROW model (Goals, Reality, Options, Will)  

**Team Support Tactics**  
• Daily 15-minute syncs  
• Skill mapping exercises  

**Mentor Tip**  
> "Ask 'What would you try next?' before giving answers"`,
    prerequisites: ["advanced_tech_support"],
    actions: [
      { type: "simulation", icon: "👥", label: "Team Simulation" },
      { type: "dashboard", icon: "📈", label: "Performance Dashboard" }
    ]
  }
];

// Interface for the user_module_progress table
interface UserModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  status: 'locked' | 'in-progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export const getUserLearningPath = async (userId: string): Promise<KnowledgeModule[]> => {
  if (!userId) {
    return [...knowledgeModules];
  }
  
  try {
    // In a real implementation, fetch the user's progress from the database
    const { data: userProgress, error } = await supabase
      .from('user_module_progress')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Clone the modules to avoid mutating the original
    const userModules = [...knowledgeModules];
    
    // If we have user progress data, update the status accordingly
    if (userProgress && userProgress.length > 0) {
      for (const progress of userProgress as UserModuleProgress[]) {
        const moduleIndex = userModules.findIndex(m => m.id === progress.module_id);
        if (moduleIndex >= 0) {
          userModules[moduleIndex].status = progress.status;
        }
      }
    } else {
      // For new users, set the first module as in-progress and others as locked
      userModules[0].status = 'in-progress';
      for (let i = 1; i < userModules.length; i++) {
        userModules[i].status = 'locked';
      }
    }
    
    return userModules;
  } catch (error) {
    console.error("Error fetching user learning path:", error);
    return [...knowledgeModules];
  }
};

export const updateModuleStatus = async (
  userId: string, 
  moduleId: string, 
  status: 'in-progress' | 'completed'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_module_progress')
      .upsert({
        user_id: userId,
        module_id: moduleId,
        status,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,module_id'
      });
      
    if (error) throw error;
    
    // If a module is completed, unlock the next one
    if (status === 'completed') {
      const moduleIndex = knowledgeModules.findIndex(m => m.id === moduleId);
      if (moduleIndex >= 0 && moduleIndex < knowledgeModules.length - 1) {
        const nextModuleId = knowledgeModules[moduleIndex + 1].id;
        await supabase
          .from('user_module_progress')
          .upsert({
            user_id: userId,
            module_id: nextModuleId,
            status: 'in-progress',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,module_id'
          });
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error updating module status:", error);
    return false;
  }
};

// Track module view analytics
export const trackModuleView = async (userId: string, moduleId: string): Promise<void> => {
  try {
    await supabase
      .from('user_module_views')
      .insert({
        user_id: userId,
        module_id: moduleId,
        view_timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.error("Error tracking module view:", error);
  }
};
