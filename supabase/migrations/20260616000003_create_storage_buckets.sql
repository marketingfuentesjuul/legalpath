-- Create storage buckets if they do not exist, and ensure they are public
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos-casos', 'documentos-casos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('case-attachments', 'case-attachments', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Safe policy creation for storage objects
DO $$
BEGIN
    -- Public SELECT access for both buckets
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Public Access to Case Docs'
    ) THEN
        CREATE POLICY "Public Access to Case Docs" ON storage.objects 
        FOR SELECT 
        USING (bucket_id = 'documentos-casos' OR bucket_id = 'case-attachments');
    END IF;

    -- INSERT access for case documents upload (both buckets)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Allow Case Docs Uploads'
    ) THEN
        CREATE POLICY "Allow Case Docs Uploads" ON storage.objects 
        FOR INSERT 
        WITH CHECK (bucket_id = 'documentos-casos' OR bucket_id = 'case-attachments');
    END IF;
END
$$;
