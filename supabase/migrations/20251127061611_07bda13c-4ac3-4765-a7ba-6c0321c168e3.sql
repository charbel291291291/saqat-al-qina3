-- Create storage bucket for case evidence
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'case-evidence',
  'case-evidence',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- Storage policies for case evidence
CREATE POLICY "Anyone can view case evidence"
ON storage.objects FOR SELECT
USING (bucket_id = 'case-evidence');

CREATE POLICY "Authenticated users can upload case evidence"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'case-evidence' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own evidence"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'case-evidence' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own evidence"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'case-evidence' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Enable realtime for officials table to update scores live
ALTER TABLE public.officials REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.officials;