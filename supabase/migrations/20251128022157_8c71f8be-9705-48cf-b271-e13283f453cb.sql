-- Create app_role enum if it doesn't exist (for journalists)
DO $$ BEGIN
  CREATE TYPE public.journalist_role AS ENUM ('investigator', 'journalist', 'editor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create journalists table
CREATE TABLE IF NOT EXISTS public.journalists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  role journalist_role NOT NULL DEFAULT 'journalist',
  phone_number TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  assigned_journalist UUID REFERENCES public.journalists(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add assigned_journalist to cases table
ALTER TABLE public.cases 
ADD COLUMN IF NOT EXISTS assigned_journalist UUID REFERENCES public.journalists(id) ON DELETE SET NULL;

-- Enable RLS on journalists table
ALTER TABLE public.journalists ENABLE ROW LEVEL SECURITY;

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for journalists table
CREATE POLICY "Anyone can view active journalists"
ON public.journalists
FOR SELECT
USING (active = true);

CREATE POLICY "Admins can manage all journalists"
ON public.journalists
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for categories table
CREATE POLICY "Anyone can view categories"
ON public.categories
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update cases RLS to allow journalists to see their assigned cases
CREATE POLICY "Journalists can view assigned cases"
ON public.cases
FOR SELECT
USING (
  assigned_journalist = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin'::app_role, 'investigator'::app_role)
  )
);

-- Trigger for updated_at on journalists
CREATE TRIGGER update_journalists_updated_at
BEFORE UPDATE ON public.journalists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on categories
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, slug) VALUES
  ('بيئة', 'environment'),
  ('بلدية', 'municipality'),
  ('فساد', 'corruption'),
  ('مدرسة', 'school'),
  ('صحة', 'health'),
  ('أمن', 'security'),
  ('خدمات عامة', 'public-services'),
  ('أخرى', 'other')
ON CONFLICT (slug) DO NOTHING;