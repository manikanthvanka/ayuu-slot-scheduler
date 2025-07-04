
-- Add token tracking table for appointments
CREATE TABLE public.appointment_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_date DATE NOT NULL,
  current_token INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(appointment_date)
);

-- Create function to get next token number for a date
CREATE OR REPLACE FUNCTION public.get_next_token(appointment_date DATE)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_token INTEGER;
BEGIN
  -- Insert or update the token count for the date
  INSERT INTO public.appointment_tokens (appointment_date, current_token)
  VALUES (appointment_date, 1)
  ON CONFLICT (appointment_date)
  DO UPDATE SET 
    current_token = appointment_tokens.current_token + 1,
    updated_at = now();
  
  -- Get the current token number
  SELECT current_token INTO next_token
  FROM public.appointment_tokens
  WHERE appointment_tokens.appointment_date = get_next_token.appointment_date;
  
  RETURN next_token;
END;
$$;

-- Add username column to profiles table if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create function to check username availability
CREATE OR REPLACE FUNCTION public.is_username_available(check_username TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE username = check_username
  );
$$;

-- Create function to get email by username
CREATE OR REPLACE FUNCTION public.get_email_by_username(check_username TEXT)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT email FROM public.profiles WHERE username = check_username LIMIT 1;
$$;

-- Enable RLS on appointment_tokens
ALTER TABLE public.appointment_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for appointment_tokens
CREATE POLICY "Appointment tokens are viewable by everyone" 
  ON public.appointment_tokens 
  FOR SELECT 
  USING (true);

CREATE POLICY "Staff can manage appointment tokens" 
  ON public.appointment_tokens 
  FOR ALL 
  USING (true);
