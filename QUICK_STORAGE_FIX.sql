-- 🚀 빠른 Storage 버킷 생성 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. 필수 버킷들 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('company-logos', 'company-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('dashboard-logos', 'dashboard-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('employee-photos', 'employee-photos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- 2. Storage 정책 설정
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (true);

-- 3. 결과 확인
SELECT '✅ Storage 버킷 생성 완료!' as status;
SELECT name, public, file_size_limit FROM storage.buckets WHERE name IN ('company-logos', 'dashboard-logos', 'employee-photos'); 