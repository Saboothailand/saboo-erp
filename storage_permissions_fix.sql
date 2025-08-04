-- Supabase Storage 권한 문제 해결 스크립트
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- 1. employee_photos 버킷이 존재하는지 확인하고 없으면 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'employee_photos',
  'employee_photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. logos 버킷이 존재하는지 확인하고 없으면 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos',
  'logos',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS 정책 삭제 (기존 정책 제거)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to employee_photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to logos" ON storage.objects;

-- 4. 새로운 RLS 정책 생성 (모든 사용자에게 접근 허용)
CREATE POLICY "Public Access to employee_photos" ON storage.objects
FOR ALL USING (bucket_id = 'employee_photos')
WITH CHECK (bucket_id = 'employee_photos');

CREATE POLICY "Public Access to logos" ON storage.objects
FOR ALL USING (bucket_id = 'logos')
WITH CHECK (bucket_id = 'logos');

-- 5. 버킷별 RLS 정책 생성
CREATE POLICY "Public Access to all buckets" ON storage.objects
FOR ALL USING (true)
WITH CHECK (true);

-- 6. 버킷 상태 확인
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id IN ('employee_photos', 'logos');

-- 7. RLS 정책 상태 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'; 