import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface PracticeSession {
  id?: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationSeconds: number;
  audioUrl?: string;
  transcript?: string;
  wordCount?: number;
  fillerWordCount?: number;
  clarityScore?: number;
  confidenceScore?: number;
  vocalVarietyScore?: number;
  aiFeedback?: {
    suggestions: string[];
  };
}

export const usePracticeSession = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async (topic: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced', maxDuration: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processRecording(audioBlob, topic, difficulty, recordingTime);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now();
      setRecordingTime(0);
      setCurrentSession({ topic, difficulty, durationSeconds: 0 });
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingTime(elapsed);
        
        // Auto-stop at max duration
        if (elapsed >= maxDuration) {
          stopRecording();
        }
      }, 1000);
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: `Speaking on: ${topic}`,
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  }, [recordingTime, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const processRecording = async (audioBlob: Blob, topic: string, difficulty: string, duration: number) => {
    setIsProcessing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Convert blob to base64
      const reader = new FileReader();
      const audioBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(audioBlob);
      });

      // Upload audio to storage
      const fileName = `${user.id}/${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('practice-audio')
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('practice-audio')
        .getPublicUrl(fileName);

      // Transcribe audio
      toast({
        title: "Processing",
        description: "Transcribing your speech...",
      });

      const { data: transcriptData, error: transcriptError } = await supabase.functions
        .invoke('transcribe-audio', {
          body: { audioBase64 }
        });

      if (transcriptError) throw transcriptError;

      // Analyze speech
      toast({
        title: "Processing",
        description: "Analyzing your speech...",
      });

      const { data: analysisData, error: analysisError } = await supabase.functions
        .invoke('analyze-speech', {
          body: {
            transcript: transcriptData.transcript,
            wordCount: transcriptData.wordCount,
            duration: duration
          }
        });

      if (analysisError) throw analysisError;

      // Save session to database
      const { data: sessionData, error: sessionError } = await supabase
        .from('practice_sessions')
        .insert({
          user_id: user.id,
          topic,
          difficulty,
          duration_seconds: duration,
          audio_url: publicUrl,
          transcript: transcriptData.transcript,
          word_count: transcriptData.wordCount,
          filler_word_count: analysisData.fillerWordCount,
          clarity_score: analysisData.scores.clarity,
          confidence_score: analysisData.scores.confidence,
          vocal_variety_score: analysisData.scores.vocalVariety,
          ai_feedback: { suggestions: analysisData.suggestions }
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      setCurrentSession({
        id: sessionData.id,
        topic,
        difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        durationSeconds: duration,
        audioUrl: publicUrl,
        transcript: transcriptData.transcript,
        wordCount: transcriptData.wordCount,
        fillerWordCount: analysisData.fillerWordCount,
        clarityScore: analysisData.scores.clarity,
        confidenceScore: analysisData.scores.confidence,
        vocalVarietyScore: analysisData.scores.vocalVariety,
        aiFeedback: { suggestions: analysisData.suggestions }
      });

      toast({
        title: "Success!",
        description: "Your session has been analyzed",
      });

    } catch (error) {
      console.error('Error processing recording:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process recording",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetSession = useCallback(() => {
    setCurrentSession(null);
    setRecordingTime(0);
  }, []);

  return {
    isRecording,
    isProcessing,
    recordingTime,
    currentSession,
    startRecording,
    stopRecording,
    resetSession
  };
};