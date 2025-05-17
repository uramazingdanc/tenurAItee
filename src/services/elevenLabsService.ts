
// ElevenLabs API service
// API Documentation: https://docs.elevenlabs.io/api-reference

import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Voice IDs from ElevenLabs
const VOICES = {
  rachel: 'EXAVITQu4vr4xnSDxMaL', // Female voice (Sarah)
  adam: 'pNInz6obpgDQGcFmaJgB', // Male voice
};

// Model options
const MODELS = {
  multilingual: 'eleven_multilingual_v2',
  turbo: 'eleven_turbo_v2',
};

interface TextToSpeechOptions {
  text: string;
  voiceId?: string;
  model?: string;
  stability?: number;
  similarity?: number;
  speakerBoost?: boolean;
}

// Function to convert text to speech using the ElevenLabs API via Edge Function
export const textToSpeech = async ({
  text,
  voiceId = VOICES.rachel,
  model = MODELS.turbo,
  stability = 0.5,
  similarity = 0.75,
  speakerBoost = true,
}: TextToSpeechOptions): Promise<string> => {
  try {
    console.log('Calling text-to-speech function with:', { voiceId, model });
    
    // Call the Supabase Edge Function that handles ElevenLabs API
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: {
        text,
        voice_id: voiceId,
        model_id: model,
        voice_settings: {
          stability,
          similarity_boost: similarity,
          speaker_boost: speakerBoost,
        },
      },
    });

    if (error) {
      console.error('Error calling text-to-speech function:', error);
      toast({
        title: 'Audio Generation Failed',
        description: 'ElevenLabs API error: ' + (error.message || 'Unknown error'),
        variant: 'destructive',
      });
      throw new Error(`Failed to convert text to speech: ${error.message}`);
    }

    if (!data || !data.audio_url) {
      console.error('Invalid response from text-to-speech function:', data);
      toast({
        title: 'Audio Generation Failed',
        description: data?.error || 'Failed to get audio URL from ElevenLabs API',
        variant: 'destructive',
      });
      throw new Error('Failed to get audio URL from ElevenLabs API');
    }

    console.log('Successfully generated audio');
    return data.audio_url;
  } catch (error) {
    console.error('Error in textToSpeech:', error);
    throw error;
  }
};

// Export voice constants for easy access
export const voices = VOICES;
export const models = MODELS;
