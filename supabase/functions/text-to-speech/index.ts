
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface RequestBody {
  text: string;
  voice_id: string;
  model_id: string;
  voice_settings: {
    stability: number;
    similarity_boost: number;
    speaker_boost: boolean;
  };
}

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
    // Get API key from environment variable
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { text, voice_id, model_id, voice_settings } = await req.json() as RequestBody;

    if (!text || !voice_id) {
      return new Response(
        JSON.stringify({ error: 'Text and voice_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting ElevenLabs API request with:', { voice_id, model_id });

    // Prepare request data for ElevenLabs API
    const elevenlabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`;
    
    const response = await fetch(elevenlabsUrl, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id,
        voice_settings,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs API error:', errorData);
      return new Response(
        JSON.stringify({ error: `ElevenLabs API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the audio data
    const audioData = await response.arrayBuffer();
    
    // Create a base64 string from the audio data
    // Fix: Process the array buffer correctly to avoid Maximum call stack size exceeded
    const base64Audio = arrayBufferToBase64(audioData);
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return new Response(
      JSON.stringify({ audio_url: audioUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to convert ArrayBuffer to base64 without stack overflow
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 1024; // Process in smaller chunks to avoid call stack issues
  
  for (let i = 0; i < bytes.byteLength; i += chunkSize) {
    const chunk = bytes.slice(i, Math.min(i + chunkSize, bytes.byteLength));
    const chunkString = String.fromCharCode.apply(null, [...chunk]);
    binary += chunkString;
  }
  
  return btoa(binary);
}
