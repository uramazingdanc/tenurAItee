
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    
    // @ts-ignore: Expected for Supabase import to be recognized in edge functions
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create the table for scenario response scores if it doesn't exist
    const { error } = await supabaseAdmin.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS public.scenario_response_scores (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id),
          scenario_id TEXT NOT NULL,
          step INTEGER NOT NULL,
          score INTEGER NOT NULL,
          feedback TEXT,
          agent_response TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add RLS policies
        ALTER TABLE public.scenario_response_scores ENABLE ROW LEVEL SECURITY;
        
        -- Create policy that allows users to view their own scores
        CREATE POLICY IF NOT EXISTS "Users can view their own scores"
          ON public.scenario_response_scores
          FOR SELECT
          USING (auth.uid() = user_id);
      `
    });
    
    if (error) {
      console.error('Error creating table:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-scenario-scores-table function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
