-- 직원 사진을 위한 Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'employee_photos',
  'employee_photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 직원 사진 버킷에 대한 RLS 정책 설정
CREATE POLICY "Allow public read access to employee photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'employee_photos');

CREATE POLICY "Allow authenticated users to upload employee photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'employee_photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated users to update employee photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'employee_photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated users to delete employee photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'employee_photos' 
    AND auth.role() = 'authenticated'
  ); 