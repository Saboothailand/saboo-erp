-- Storage RLS 정책 수정 (employee-photos 버킷)
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 정책 삭제
DROP POLICY IF EXISTS "Public Access to employee_photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to employee-photos" ON storage.objects;

-- 2. 새로운 정책 생성 (employee-photos 버킷용)
CREATE POLICY "Public Access to employee-photos" ON storage.objects
FOR ALL USING (bucket_id = 'employee-photos')
WITH CHECK (bucket_id = 'employee-photos');

-- 3. 버킷이 존재하는지 확인하고 없으면 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('employee-photos', 'employee-photos', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public;

-- 4. 정책 확인
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
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- 5. 버킷 목록 확인
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE name IN ('employee-photos', 'logos'); 