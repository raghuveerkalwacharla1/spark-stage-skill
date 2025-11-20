-- Fix function search path security issue by recreating with proper settings
CREATE OR REPLACE FUNCTION public.update_practice_sessions_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;