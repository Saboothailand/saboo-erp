-- 🚀 데이터베이스 마이그레이션 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. Storage 버킷 생성
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

-- 3. 기본 테이블 생성 (기존 스크립트 실행)
\i payroll_system_supabase.sql

-- 4. 샘플 데이터 삽입
\i sample_data.sql

-- 5. 결과 확인
SELECT '✅ 마이그레이션 완료!' as status;
SELECT name, public FROM storage.buckets WHERE name IN ('company-logos', 'dashboard-logos', 'employee-photos');
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'; 