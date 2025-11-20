import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Play, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Session {
  id: string;
  topic: string;
  difficulty: string;
  duration_seconds: number;
  transcript: string;
  word_count: number;
  filler_word_count: number;
  clarity_score: number;
  confidence_score: number;
  vocal_variety_score: number;
  ai_feedback: any;
  audio_url: string;
  created_at: string;
}

export const SessionHistory: React.FC = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load session history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'Beginner') return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (difficulty === 'Intermediate') return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    return 'bg-red-500/10 text-red-600 border-red-500/20';
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>Your last 10 practice sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No sessions yet. Start practicing to see your history!
            </p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-lg bg-background border hover:border-speaking cursor-pointer transition-colors"
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{session.topic}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(session.created_at)}
                        <Clock className="w-3 h-3 ml-2" />
                        {formatTime(session.duration_seconds)}
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(session.difficulty)}>
                      {session.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Clarity: <strong>{session.clarity_score}%</strong></span>
                    <span>Confidence: <strong>{session.confidence_score}%</strong></span>
                    <span>Variety: <strong>{session.vocal_variety_score}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSession && (
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedSession.topic}</DialogTitle>
              <DialogDescription>
                <Badge className={getDifficultyColor(selectedSession.difficulty)}>
                  {selectedSession.difficulty}
                </Badge>
                <span className="ml-2">{formatDate(selectedSession.created_at)}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background border">
                <h4 className="font-semibold mb-2">Transcript</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedSession.word_count} words • {formatTime(selectedSession.duration_seconds)}
                </p>
                <p className="text-sm">{selectedSession.transcript}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-background border text-center">
                  <p className="text-sm text-muted-foreground mb-1">Clarity</p>
                  <p className="text-2xl font-bold text-speaking">{selectedSession.clarity_score}%</p>
                </div>
                <div className="p-4 rounded-lg bg-background border text-center">
                  <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-speaking">{selectedSession.confidence_score}%</p>
                </div>
                <div className="p-4 rounded-lg bg-background border text-center">
                  <p className="text-sm text-muted-foreground mb-1">Vocal Variety</p>
                  <p className="text-2xl font-bold text-speaking">{selectedSession.vocal_variety_score}%</p>
                </div>
              </div>

              {selectedSession.ai_feedback && (
                <div className="p-4 rounded-lg bg-speaking/5 border border-speaking/20">
                  <h4 className="font-semibold mb-3">AI Feedback</h4>
                  <ul className="space-y-2">
                    {selectedSession.ai_feedback.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-speaking font-bold">{idx + 1}.</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedSession.audio_url && (
                <div className="p-4 rounded-lg bg-background border">
                  <h4 className="font-semibold mb-2">Audio Recording</h4>
                  <audio controls className="w-full">
                    <source src={selectedSession.audio_url} type="audio/webm" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};