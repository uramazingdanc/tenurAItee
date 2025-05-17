
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
function handleCORS(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
}

// Function to simulate backend AI response generation
// In a real implementation, this would connect to OpenAI or another LLM
async function generateAIResponse(message: string, history: any[]) {
  // Mock KB articles to simulate RAG functionality
  const mockKbArticles = [
    {
      id: "1",
      title: "Handling Flight Cancellations",
      excerpt: "Step-by-step guide on helping customers with flight cancellations",
      url: "/knowledge/flight-cancellations"
    },
    {
      id: "2",
      title: "Refund Policies",
      excerpt: "Information about refund processing times and eligibility",
      url: "/knowledge/refund-policies"
    }
  ];

  // Generate simple response based on user input
  let response = "";
  let suggestions: string[] = [];
  let kb_articles = [];
  
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes("help")) {
    response = "I can help you with training scenarios, answer questions about customer service techniques, or provide feedback on your past performance. What would you like assistance with?";
    suggestions = ["Show me training scenarios", "How do I improve my customer satisfaction score?", "What are best practices for handling angry customers?"];
  } 
  else if (messageLower.includes("scenario") || messageLower.includes("training")) {
    response = "We have several scenarios available for practice. The 'Flight Cancellation' scenario is recommended for beginners. Would you like to try it?";
    kb_articles = [mockKbArticles[0]];
  } 
  else if (messageLower.includes("progress") || messageLower.includes("score")) {
    response = "You're making great progress! You've completed 65% of your current level. Keep practicing the de-escalation techniques to improve further.";
    suggestions = ["Show me my weak areas", "What should I focus on next?"];
  } 
  else if (messageLower.includes("badge") || messageLower.includes("achievement")) {
    response = "You currently have 8 badges. To earn the 'Knowledge Master' badge, you'll need to read all the basic knowledge articles.";
  }
  else if (messageLower.includes("refund") || messageLower.includes("money back")) {
    response = "When handling refund requests, always verify the customer's eligibility first according to our policy. Would you like to review our refund policies?";
    kb_articles = [mockKbArticles[1]];
  }
  else {
    response = "That's an interesting question. I'd recommend practicing with more scenarios to improve in that area. Is there a specific skill you'd like to focus on?";
    suggestions = ["De-escalation techniques", "Product knowledge", "Empathy training"];
  }
  
  // In real implementation, you would call OpenAI API here
  
  return {
    response,
    suggestions,
    kb_articles: kb_articles.length > 0 ? kb_articles : undefined
  };
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const { message, history } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }
    
    // Generate AI response
    const aiResponse = await generateAIResponse(message, history || []);
    
    return new Response(
      JSON.stringify(aiResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})
