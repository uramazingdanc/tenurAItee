
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
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
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
    ],
    quiz: [
      {
        question: "Which of the following is NOT one of the 3 A's of customer service?",
        options: ["Acknowledge", "Act", "Apologize", "Assist"],
        correctAnswer: 3
      },
      {
        question: "What is the primary goal of active listening in customer service?",
        options: [
          "To finish the call quickly",
          "To understand the customer's needs fully",
          "To avoid asking questions",
          "To transfer the call to a supervisor"
        ],
        correctAnswer: 1
      }
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
    ],
    quiz: [
      {
        question: "What is the first step in the LEARN de-escalation framework?",
        options: ["Lead the conversation", "Listen without interrupting", "Look for solutions", "Limit talking time"],
        correctAnswer: 1
      }
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
    ],
    quiz: [
      {
        question: "What should be done after testing a fix in the troubleshooting flowchart?",
        options: ["Close the ticket", "Check logs", "Document the solution", "Call the customer"],
        correctAnswer: 2
      }
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
    ],
    quiz: [
      {
        question: "What is a key principle of the debugging mindset mentioned in this module?",
        options: [
          "Assume common solutions first",
          "Verify only critical components",
          "Assume nothing, verify everything",
          "Document only successful tests"
        ],
        correctAnswer: 2
      }
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
    ],
    quiz: [
      {
        question: "What does the 'R' in the GROW coaching model stand for?",
        options: ["Results", "Reality", "Responsibility", "Roadmap"],
        correctAnswer: 1
      }
    ]
  },
  // Knowledge category modules for different tabs
  { 
    id: "handling_calls_basics", 
    name: "Call Handling Fundamentals", 
    description: "Essential techniques for professional call management",
    status: "in-progress",
    content: `**Call Structure Blueprint**  
✅ Professional greeting with name and department  
✅ Active listening and note-taking  
✅ Clear communication techniques  
✅ Proper call closure with next steps  

**Voice Techniques**  
• Moderate pace (150-160 words per minute)  
• Varied tone to emphasize key points  
• Brief pauses after important information  

**Pro Tip**  
> "The first 10 seconds set the tone for the entire call."`,
    actions: [
      { type: "audio", icon: "🎧", label: "Call Examples" },
      { type: "guide", icon: "📝", label: "Script Templates" }
    ],
    quiz: [
      {
        question: "What is the ideal speaking pace for customer service calls?",
        options: [
          "As fast as possible to handle more calls",
          "100-120 words per minute",
          "150-160 words per minute", 
          "Over 200 words per minute for efficiency"
        ],
        correctAnswer: 2
      }
    ]
  },
  { 
    id: "handling_calls_deescalation", 
    name: "De-escalation Techniques", 
    description: "Strategies for calming upset customers and finding solutions",
    status: "locked",
    content: `**Critical De-escalation Steps**  
1. Lower your voice as they raise theirs  
2. Use the customer's name naturally  
3. Acknowledge emotions explicitly  
4. Reframe problems as solvable challenges  
5. Provide clear, actionable next steps  

**Effective Phrases**  
• "I hear how frustrating this situation is for you..."  
• "Let me make sure I understand what happened..."  
• "Here's what I can do right now to help..."  

**Red Flags for Escalation**  
⚠️ Repetitive complaints or questions  
⚠️ Extended silence after explanations  
⚠️ Statements like "Let me speak to your manager"`,
    prerequisites: ["handling_calls_basics"],
    actions: [
      { type: "simulation", icon: "🗣️", label: "Practice Scenarios" },
      { type: "video", icon: "📹", label: "Expert Examples" }
    ],
    quiz: [
      {
        question: "When a customer raises their voice, what should you do with yours?",
        options: [
          "Match their volume to show confidence",
          "Speak louder to be heard clearly",
          "Lower your voice to create contrast",
          "Maintain the same volume consistently"
        ],
        correctAnswer: 2
      }
    ]
  },
  { 
    id: "process_bookings_new", 
    name: "New Booking Process", 
    description: "Step-by-step guide to creating error-free new bookings",
    status: "in-progress",
    content: `**Essential Booking Fields**  
✅ Full passenger name(s) as on ID  
✅ Valid contact information  
✅ Accurate travel dates and times  
✅ Special requests or accommodations  
✅ Payment verification details  

**Common Booking Errors**  
• Name misspellings  
• Date format confusion (MM/DD vs DD/MM)  
• Missing required documentation notes  

**System Navigation Shortcuts**  
⌘+B - New booking screen  
⌘+F - Find existing booking  
⌘+S - Save booking draft`,
    actions: [
      { type: "lab", icon: "💻", label: "System Simulation" },
      { type: "checklist", icon: "✅", label: "Booking Checklist" }
    ],
    quiz: [
      {
        question: "Which of these is NOT one of the essential booking fields?",
        options: [
          "Full passenger name as on ID",
          "Passenger's date of birth",
          "Valid contact information",
          "Accurate travel dates and times"
        ],
        correctAnswer: 1
      }
    ]
  },
  { 
    id: "modify_bookings_policies", 
    name: "Booking Modification Policies", 
    description: "Understanding fare rules, fees, and modification procedures",
    status: "locked",
    content: `**Modification Fee Structure**  
| Fare Type | > 7 Days Prior | 2-7 Days Prior | < 48 Hours Prior |
|-----------|----------------|----------------|------------------|
| Basic     | $50            | $75            | $100             |
| Flexible  | $25            | $35            | $50              |
| Premium   | $0             | $0             | $25              |

**Exception Conditions**  
• Medical emergencies (documentation required)  
• Severe weather events  
• Bereavement (immediate family only)  

**Policy Communication Tips**  
• Explain fees before processing changes  
• Offer alternatives when applicable  
• Document all customer acknowledgments`,
    prerequisites: ["process_bookings_new"],
    actions: [
      { type: "calculator", icon: "🧮", label: "Fee Calculator" },
      { type: "guide", icon: "📋", label: "Exception Guidelines" }
    ],
    quiz: [
      {
        question: "What documentation is typically required for a medical emergency exception?",
        options: [
          "No documentation needed",
          "Doctor's note or medical record",
          "Insurance claim number",
          "Pharmacy receipt"
        ],
        correctAnswer: 1
      }
    ]
  },
  { 
    id: "cancel_bookings_procedure", 
    name: "Cancellation Procedures", 
    description: "Guidelines for processing cancellations and determining refund eligibility",
    status: "locked",
    content: `**Cancellation Checklist**  
1. Verify booking details and customer identity  
2. Review fare rules for cancellation terms  
3. Explain refund eligibility and processing time  
4. Offer alternatives (credit, rebooking, etc.)  
5. Process cancellation with confirmation number  
6. Document reason for analytics  

**Refund Eligibility Matrix**  
| Fare Type | > 24 Hours After Booking | < 24 Hours After Booking |
|-----------|--------------------------|--------------------------|
| Non-refundable | Credit only (-$50 fee) | Full refund |
| Refundable | Full refund | Full refund |

**DOT Regulations for US Flights**  
• 24-hour refund rule for bookings made 7+ days before flight  
• Refunds must be processed within 7 business days for credit card payments  
• Proper disclosure of all material restrictions`,
    prerequisites: ["modify_bookings_policies"],
    actions: [
      { type: "flowchart", icon: "📊", label: "Decision Tree" },
      { type: "template", icon: "📝", label: "Cancellation Templates" }
    ],
    quiz: [
      {
        question: "Per DOT regulations, within how many business days must refunds be processed for credit card payments?",
        options: ["3 business days", "7 business days", "14 business days", "30 business days"],
        correctAnswer: 1
      }
    ]
  },
  { 
    id: "refund_requests_processing", 
    name: "Refund Request Processing", 
    description: "Handling refund requests efficiently and accurately",
    status: "locked",
    content: `**Refund Documentation Requirements**  
✅ Original booking confirmation  
✅ Proof of payment (receipt/statement)  
✅ Cancellation confirmation (if applicable)  
✅ Supporting documentation for exceptions  

**Processing Timeline by Payment Type**  
• Credit Card: 5-7 business days  
• Debit Card: 7-10 business days  
• Check: 2-3 weeks  
• Travel Credit: 24-48 hours  

**Dispute Resolution Framework**  
1. Listen completely to customer's claim  
2. Validate claim against documented policies  
3. Explain decision with specific policy references  
4. Offer available alternatives  
5. Escalate to supervisor when necessary`,
    prerequisites: ["cancel_bookings_procedure"],
    actions: [
      { type: "form", icon: "📄", label: "Refund Request Form" },
      { type: "tracker", icon: "🔍", label: "Status Tracker" }
    ],
    quiz: [
      {
        question: "Which payment type typically has the longest refund processing time?",
        options: ["Credit Card", "Debit Card", "Check", "Travel Credit"],
        correctAnswer: 2
      }
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
      // For new users, set the first module of each category as in-progress and others as locked
      const categoryStarters = new Set([
        "basic_customer_service", 
        "handling_calls_basics",
        "process_bookings_new"
      ]);
      
      for (let i = 0; i < userModules.length; i++) {
        if (categoryStarters.has(userModules[i].id)) {
          userModules[i].status = 'in-progress';
        } else {
          userModules[i].status = 'locked';
        }
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
    
    // If a module is completed, unlock the next one based on prerequisites
    if (status === 'completed') {
      // Find the current module
      const currentModule = knowledgeModules.find(m => m.id === moduleId);
      if (!currentModule) return true;
      
      // Find all modules that have this module as a prerequisite
      const nextModules = knowledgeModules.filter(m => 
        m.prerequisites?.includes(moduleId)
      );
      
      // Unlock all direct dependent modules
      for (const nextModule of nextModules) {
        // Check if all prerequisites are completed
        const allPrereqsCompleted = await areAllPrerequisitesCompleted(userId, nextModule.prerequisites || []);
        
        if (allPrereqsCompleted) {
          await supabase
            .from('user_module_progress')
            .upsert({
              user_id: userId,
              module_id: nextModule.id,
              status: 'in-progress',
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,module_id'
            });
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error updating module status:", error);
    return false;
  }
};

// Helper to check if all prerequisites are completed
async function areAllPrerequisitesCompleted(userId: string, prerequisites: string[]): Promise<boolean> {
  if (!prerequisites.length) return true;
  
  try {
    const { data, error } = await supabase
      .from('user_module_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .in('module_id', prerequisites);
      
    if (error) throw error;
    
    // Check if we have a completed record for each prerequisite
    return data?.length === prerequisites.length;
  } catch (error) {
    console.error("Error checking prerequisites:", error);
    return false;
  }
}

// Track module view analytics
export const trackModuleView = async (userId: string, moduleId: string, timeSpent?: number): Promise<void> => {
  try {
    const data = {
      user_id: userId,
      module_id: moduleId,
      view_timestamp: new Date().toISOString()
    };
    
    if (timeSpent !== undefined) {
      data['time_spent'] = timeSpent;
    }
    
    await supabase
      .from('user_module_views')
      .insert(data);
  } catch (error) {
    console.error("Error tracking module view:", error);
  }
};

// Get quiz questions for a module
export const getModuleQuiz = async (moduleId: string): Promise<any[]> => {
  // In a real app, fetch from database
  const module = knowledgeModules.find(m => m.id === moduleId);
  return module?.quiz || [];
};

// Submit quiz answers
export const submitQuizAnswers = async (userId: string, moduleId: string, answers: number[]): Promise<{ 
  score: number;
  correct: number;
  total: number;
  isModuleCompleted: boolean;
}> => {
  try {
    // Get quiz questions to check answers
    const quiz = await getModuleQuiz(moduleId);
    if (!quiz.length) return { score: 0, correct: 0, total: 0, isModuleCompleted: false };
    
    // Calculate score
    let correctAnswers = 0;
    for (let i = 0; i < Math.min(quiz.length, answers.length); i++) {
      if (answers[i] === quiz[i].correctAnswer) {
        correctAnswers++;
      }
    }
    
    const score = (correctAnswers / quiz.length) * 100;
    const passingScore = 70;
    const isModuleCompleted = score >= passingScore;
    
    // If passed, mark module as completed
    if (isModuleCompleted) {
      await updateModuleStatus(userId, moduleId, 'completed');
    }
    
    // In a real app, save quiz results to database
    // ...
    
    return {
      score,
      correct: correctAnswers,
      total: quiz.length,
      isModuleCompleted
    };
  } catch (error) {
    console.error("Error submitting quiz answers:", error);
    return { score: 0, correct: 0, total: 0, isModuleCompleted: false };
  }
};
