-- 로고 업로드를 위한 Storage 버킷 생성 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. 회사 로고용 버킷 (company-logos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos',
  'company-logos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. 대시보드 로고용 버킷 (dashboard-logos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dashboard-logos',
  'dashboard-logos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 3. 직원 사진용 버킷 (employee-photos) - 이미 존재할 수 있음
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'employee-photos',
  'employee-photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- RLS 정책 설정 (모든 사용자가 읽기/쓰기 가능)
-- company-logos 버킷
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'company-logos');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'company-logos');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'company-logos');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'company-logos');

-- dashboard-logos 버킷
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'dashboard-logos');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'dashboard-logos');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'dashboard-logos');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'dashboard-logos');

-- employee-photos 버킷
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'employee-photos');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'employee-photos');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'employee-photos');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'employee-photos'); 