-- 🚀 안전한 Storage 설정 스크립트 (권한 문제 없음)
-- Supabase SQL Editor에서 실행하세요

-- 1. Storage 버킷 생성 (기존 버킷이 있으면 업데이트)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('company-logos', 'company-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('dashboard-logos', 'dashboard-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('employee-photos', 'employee-photos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- 2. 결과 확인
SELECT '✅ Storage 버킷 생성 완료!' as status;
SELECT name, public, file_size_limit FROM storage.buckets WHERE name IN ('company-logos', 'dashboard-logos', 'employee-photos') ORDER BY name; 