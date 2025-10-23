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

  const [userTranscript, setUserTranscript] = useState('');
  const [aiTranscript, setAiTranscript] = useState('');

  const handleMessage = (event: any) => {
    console.log("Received event:", event.type);
    
    if (event.type === 'response.audio_transcript.delta' && event.delta) {
      setAiTranscript(prev => prev + event.delta);
      setTranscript(prev => prev + event.delta);
      onTranscriptUpdate?.(event.delta);
    } else if (event.type === 'response.audio_transcript.done') {
      setTranscript('');
      setAiTranscript('');
    } else if (event.type === 'conversation.item.input_audio_transcription.completed') {
      console.log("User said:", event.transcript);
      setUserTranscript(event.transcript);
      toast({
        title: "You said:",
        description: event.transcript,
      });
    } else if (event.type === 'input_audio_buffer.speech_started') {
      console.log("User started speaking");
    } else if (event.type === 'input_audio_buffer.speech_stopped') {
      console.log("User stopped speaking");
      setUserTranscript('');
    }
  };

  const startConversation = async () => {
    try {
      chatRef.current = new RealtimeSpeaking(handleMessage, setIsSpeaking);
      await chatRef.current.connect();
      setIsConnected(true);
      
      toast({
        title: "Connected",
        description: "AI coach is ready. Start speaking to practice!",
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
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isSpeaking 
                    ? 'bg-speaking/20 animate-pulse border-2 border-speaking' 
                    : userTranscript 
                    ? 'bg-blue-500/20 animate-pulse border-2 border-blue-500'
                    : 'bg-speaking/10'
                }`}>
                  {isSpeaking ? (
                    <Volume2 className="w-8 h-8 text-speaking" />
                  ) : (
                    <Mic className="w-8 h-8 text-speaking" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-sm text-muted-foreground">
                    {isSpeaking ? '🎤 AI Coach Reviewing...' : userTranscript ? '👂 Processing your speech...' : '👋 Speak to practice!'}
                  </p>
                  {transcript && (
                    <p className="text-sm text-foreground max-w-md mt-1">
                      <span className="font-semibold">Feedback:</span> {transcript}
                    </p>
                  )}
                  {userTranscript && !isSpeaking && (
                    <p className="text-xs text-muted-foreground mt-1 italic max-w-md">
                      You: "{userTranscript}"
                    </p>
                  )}
                </div>
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
