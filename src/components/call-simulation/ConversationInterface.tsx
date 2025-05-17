
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Play, Pause, VolumeX } from "lucide-react";
import { CallStep } from "@/services/callScenarioService";
import { toast } from "@/components/ui/use-toast";

interface ConversationInterfaceProps {
  currentCustomerMessage: CallStep | null;
  isPlaying: boolean;
  isLoading: boolean;
  responseOptions: string[];
  onPlayPause: () => void;
  onSelectResponse: (response: string) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const ConversationInterface = ({ 
  currentCustomerMessage, 
  isPlaying, 
  isLoading, 
  responseOptions, 
  onPlayPause, 
  onSelectResponse,
  audioRef 
}: ConversationInterfaceProps) => {
  const [audioError, setAudioError] = useState<boolean>(false);
  
  // Handle audio errors
  const handleAudioError = () => {
    setAudioError(true);
    toast({
      title: "Audio Error",
      description: "Could not play the audio. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-xl relative">
          {isPlaying && (
            <div className="absolute -right-1 -top-1 w-4 h-4 bg-red-500 rounded-full pulse-light"></div>
          )}
          C
        </div>
        <div className="ml-4">
          <div className="font-medium">Customer</div>
          <div className="text-gray-500 text-sm">
            {currentCustomerMessage?.emotion === 'concerned' && 'Concerned'}
            {currentCustomerMessage?.emotion === 'neutral' && 'Neutral'}
            {currentCustomerMessage?.emotion === 'upset' && 'Upset'}
            {currentCustomerMessage?.emotion === 'pleased' && 'Pleased'}
            {!currentCustomerMessage?.emotion && 'Customer'}
          </div>
        </div>
        <div className="ml-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center ${isPlaying ? 'border-red-500 text-red-500' : ''} ${audioError ? 'border-red-500 text-red-500' : ''}`}
            onClick={onPlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Loading...
              </>
            ) : isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause Audio
              </>
            ) : audioError ? (
              <>
                <VolumeX className="h-4 w-4 mr-1" />
                Audio Unavailable
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Play Audio
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg mb-6">
        <p className="text-gray-700">
          {currentCustomerMessage?.message || "Loading..."}
        </p>
      </div>
      
      {/* Hidden audio element with error handler */}
      <audio 
        ref={audioRef} 
        style={{ display: 'none' }} 
        onError={handleAudioError}
        onPlay={() => setAudioError(false)}
      />

      <Separator className="my-6" />

      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-3">Choose your response:</h4>
        <div className="space-y-3">
          {responseOptions.map((option, index) => (
            <div 
              key={index}
              className="p-3 border rounded-lg hover:bg-brand-blue/5 hover:border-brand-blue cursor-pointer transition-colors"
              onClick={() => !isLoading && onSelectResponse(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ConversationInterface;
