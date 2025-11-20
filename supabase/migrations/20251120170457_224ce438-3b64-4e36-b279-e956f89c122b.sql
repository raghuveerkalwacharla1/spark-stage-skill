-- Create practice_sessions table to store user practice recordings
CREATE TABLE IF NOT EXISTS public.practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
  duration_seconds INTEGER NOT NULL,
  audio_url TEXT,
  transcript TEXT,
  word_count INTEGER,
  filler_word_count INTEGER,
  clarity_score INTEGER CHECK (clarity_score >= 0 AND clarity_score <= 100),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  vocal_variety_score INTEGER CHECK (vocal_variety_score >= 0 AND vocal_variety_score <= 100),
  ai_feedback JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own sessions"
  ON public.practice_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON public.practice_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.practice_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON public.practice_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for audio recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('practice-audio', 'practice-audio', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own audio"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'practice-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own audio"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'practice-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own audio"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'practice-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_practice_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating updated_at
CREATE TRIGGER update_practice_sessions_updated_at
  BEFORE UPDATE ON public.practice_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_practice_sessions_updated_at();