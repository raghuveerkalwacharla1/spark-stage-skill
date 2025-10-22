import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RealtimeSpeaking } from '@/utils/RealtimeAudio';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInterfaceProps {
  onTranscriptUpdate?: (transcript: string) => void;
}

const VoiceInterface = ({ onTranscriptUpdate }: VoiceInterfaceProps) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const chatRef = useRef<RealtimeSpeaking | null>(null);

  const handleMessage = (event: any) => {
    if (event.type === 'response.audio_transcript.delta' && event.delta) {
      setTranscript(prev => prev + event.delta);
      onTranscriptUpdate?.(event.delta);
    } else if (event.type === 'response.audio_transcript.done') {
      setTranscript('');
    } else if (event.type === 'conversation.item.input_audio_transcription.completed') {
      console.log("User said:", event.transcript);
    }
  };

  const startConversation = async () => {
    try {
      chatRef.current = new RealtimeSpeaking(handleMessage, setIsSpeaking);
      await chatRef.current.connect();
      setIsConnected(true);
      
      toast({
        title: "Connected",
        description: "Voice interface is ready. Start speaking!",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsSpeaking(false);
    setTranscript('');
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex flex-col items-center gap-4 bg-background/95 backdrop-blur p-6 rounded-2xl shadow-xl border-2 border-speaking">
        {!isConnected ? (
          <Button 
            onClick={startConversation}
            size="lg"
            className="bg-speaking hover:bg-speaking/90 text-white gap-2"
          >
            <Mic className="w-5 h-5" />
            Start Voice Practice
          </Button>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isSpeaking 
                  ? 'bg-speaking/20 animate-pulse' 
                  : 'bg-speaking/10'
              }`}>
                {isSpeaking ? (
                  <Volume2 className="w-8 h-8 text-speaking" />
                ) : (
                  <Mic className="w-8 h-8 text-speaking" />
                )}
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-muted-foreground">
                  {isSpeaking ? 'AI Coach Speaking...' : 'Listening...'}
                </p>
                {transcript && (
                  <p className="text-sm text-foreground max-w-xs truncate">
                    {transcript}
                  </p>
                )}
              </div>
            </div>
            <Button 
              onClick={endConversation}
              variant="outline"
              className="gap-2"
            >
              <MicOff className="w-4 h-4" />
              End Practice
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceInterface;
