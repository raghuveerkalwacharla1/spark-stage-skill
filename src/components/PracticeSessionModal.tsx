import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, StopCircle, Loader2, Clock, MessageSquare } from 'lucide-react';
import { usePracticeSession } from '@/hooks/usePracticeSession';
import { Progress } from '@/components/ui/progress';

interface Topic {
  text: string;
  hint: string;
}

interface PracticeSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const TOPICS: Record<string, Topic[]> = {
  Beginner: [
    { text: "Describe your favorite hobby", hint: "Start with 'My favorite hobby is...' and explain why you enjoy it" },
    { text: "What makes a good friend?", hint: "Think of qualities like trust, loyalty, and support" },
    { text: "Your daily routine", hint: "Walk through your typical day from morning to evening" },
    { text: "A place you'd like to visit", hint: "Describe the place and why it interests you" },
    { text: "Your favorite season", hint: "Explain what you love about this time of year" },
  ],
  Intermediate: [
    { text: "The impact of social media on society", hint: "Consider both positive and negative effects" },
    { text: "Why learning new skills is important", hint: "Discuss personal growth and career benefits" },
    { text: "How technology has changed education", hint: "Compare traditional and modern learning methods" },
    { text: "The importance of work-life balance", hint: "Discuss health, relationships, and productivity" },
    { text: "Climate change and individual responsibility", hint: "What can people do to make a difference?" },
  ],
  Advanced: [
    { text: "Artificial intelligence: opportunity or threat?", hint: "Present a balanced argument with specific examples" },
    { text: "The future of remote work", hint: "Analyze trends, challenges, and long-term implications" },
    { text: "Leadership in times of crisis", hint: "What qualities and strategies are most effective?" },
    { text: "Innovation vs. tradition in business", hint: "When should companies embrace change?" },
    { text: "The role of education in reducing inequality", hint: "Discuss systemic issues and potential solutions" },
  ],
};

const TIME_LIMITS = {
  Beginner: 180, // 3 minutes
  Intermediate: 300, // 5 minutes
  Advanced: 600, // 10 minutes
};

export const PracticeSessionModal: React.FC<PracticeSessionModalProps> = ({
  open,
  onOpenChange,
  difficulty,
}) => {
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const { isRecording, isProcessing, recordingTime, currentSession, startRecording, stopRecording, resetSession } = usePracticeSession();

  const maxDuration = TIME_LIMITS[difficulty];

  const handleStartPractice = () => {
    const topics = TOPICS[difficulty];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    setCurrentTopic(randomTopic);
    startRecording(randomTopic.text, difficulty, maxDuration);
  };

  const handleStop = () => {
    stopRecording();
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    resetSession();
    setCurrentTopic(null);
    onOpenChange(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (recordingTime / maxDuration) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-speaking" />
            Practice Session
          </DialogTitle>
          <DialogDescription>
            <Badge className="bg-speaking/10 text-speaking border-speaking/20">
              {difficulty}
            </Badge>
            <span className="ml-2">Time limit: {formatTime(maxDuration)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!currentTopic && !isProcessing && !currentSession ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Ready to practice? Click start to get a random topic
              </p>
              <Button
                onClick={handleStartPractice}
                className="bg-speaking hover:bg-speaking/90"
                size="lg"
              >
                <Mic className="w-4 h-4 mr-2" />
                Start Practice
              </Button>
            </div>
          ) : null}

          {currentTopic && !currentSession && (
            <div className="space-y-4">
              <div className="p-6 rounded-lg bg-speaking/5 border-2 border-speaking/20">
                <h3 className="text-xl font-semibold mb-2">{currentTopic.text}</h3>
                <p className="text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Hint: {currentTopic.hint}
                </p>
              </div>

              {isRecording && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-speaking" />
                      <span className="text-2xl font-bold">{formatTime(recordingTime)}</span>
                      <span className="text-muted-foreground">/ {formatTime(maxDuration)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-sm font-medium">Recording</span>
                    </div>
                  </div>

                  <Progress value={progress} className="h-2" />

                  <div className="flex justify-center">
                    <Button
                      onClick={handleStop}
                      variant="destructive"
                      size="lg"
                    >
                      <StopCircle className="w-4 h-4 mr-2" />
                      Stop Recording
                    </Button>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 animate-spin text-speaking mx-auto mb-4" />
                  <p className="text-lg font-medium">Processing your session...</p>
                  <p className="text-sm text-muted-foreground">
                    Transcribing and analyzing your speech
                  </p>
                </div>
              )}
            </div>
          )}

          {currentSession && currentSession.transcript && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background border">
                <h4 className="font-semibold mb-2">Your Speech</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {currentSession.wordCount} words • {formatTime(currentSession.durationSeconds)}
                </p>
                <p className="text-sm">{currentSession.transcript}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-background border text-center">
                  <p className="text-sm text-muted-foreground mb-1">Clarity</p>
                  <p className="text-2xl font-bold text-speaking">{currentSession.clarityScore}%</p>
                </div>
                <div className="p-4 rounded-lg bg-background border text-center">
                  <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-speaking">{currentSession.confidenceScore}%</p>
                </div>
                <div className="p-4 rounded-lg bg-background border text-center">
                  <p className="text-sm text-muted-foreground mb-1">Vocal Variety</p>
                  <p className="text-2xl font-bold text-speaking">{currentSession.vocalVarietyScore}%</p>
                </div>
              </div>

              {currentSession.aiFeedback && (
                <div className="p-4 rounded-lg bg-speaking/5 border border-speaking/20">
                  <h4 className="font-semibold mb-3">AI Coach Feedback</h4>
                  <ul className="space-y-2">
                    {currentSession.aiFeedback.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-speaking font-bold">{idx + 1}.</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {currentSession.fillerWordCount !== undefined && currentSession.fillerWordCount > 0 && (
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm">
                    <span className="font-semibold">Filler words detected:</span> {currentSession.fillerWordCount}
                    <span className="text-muted-foreground ml-2">
                      (um, uh, like, you know, etc.)
                    </span>
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    resetSession();
                    setCurrentTopic(null);
                  }}
                  className="flex-1 bg-speaking hover:bg-speaking/90"
                >
                  Practice Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};