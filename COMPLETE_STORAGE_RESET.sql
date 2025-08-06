-- 🚀 Storage 완전 초기화 및 재생성 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 Storage 정책 모두 삭제
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view files" ON storage.objects;

-- 2. 기존 Storage 버킷 완전 삭제
DELETE FROM storage.objects WHERE bucket_id IN ('company-logos', 'dashboard-logos', 'employee-photos');
DELETE FROM storage.buckets WHERE name IN ('company-logos', 'dashboard-logos', 'employee-photos');

-- 3. 새로운 Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('company-logos', 'company-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('dashboard-logos', 'dashboard-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('employee-photos', 'employee-photos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']);

-- 4. 완전한 공개 접근 정책 생성
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (true);

CREATE POLICY "Public Upload" ON storage.objects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Update" ON storage.objects
    FOR UPDATE USING (true);

CREATE POLICY "Public Delete" ON storage.objects
    FOR DELETE USING (true);

-- 5. RLS 완전 비활성화
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 6. 결과 확인
SELECT '✅ Storage 완전 초기화 완료!' as status;
SELECT name, public, file_size_limit, created_at FROM storage.buckets ORDER BY name;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage'; 