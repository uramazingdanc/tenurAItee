
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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

serve(async (req) => {
  try {
    // Get API key from environment variable
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { text, voice_id, model_id, voice_settings } = await req.json() as RequestBody;

    if (!text || !voice_id) {
      return new Response(
        JSON.stringify({ error: 'Text and voice_id are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare request data for ElevenLabs API
    const elevenlabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}/stream`;
    
    const response = await fetch(elevenlabsUrl, {
      method: 'POST',
      headers: {
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
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the audio data
    const audioData = await response.arrayBuffer();
    
    // Create a temporary audio URL
    // In a production environment, you might want to store this in Supabase Storage
    const audio = Buffer.from(audioData).toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${audio}`;

    return new Response(
      JSON.stringify({ audio_url: audioUrl }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
