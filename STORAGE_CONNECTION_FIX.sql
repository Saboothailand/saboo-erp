-- 🚀 Storage 연결 문제 해결 스크립트
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

-- 2. Storage 버킷 재생성 (기존 정책 초기화)
DELETE FROM storage.buckets WHERE name IN ('company-logos', 'dashboard-logos', 'employee-photos');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('company-logos', 'company-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('dashboard-logos', 'dashboard-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('employee-photos', 'employee-photos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']);

-- 3. 완전한 공개 접근 정책 생성
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (true);

CREATE POLICY "Public Upload" ON storage.objects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Update" ON storage.objects
    FOR UPDATE USING (true);

CREATE POLICY "Public Delete" ON storage.objects
    FOR DELETE USING (true);

-- 4. RLS 비활성화 (임시로)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 5. 버킷 상태 확인
SELECT 
    'Storage 버킷 상태' as info,
    id,
    name,
    public,
    file_size_limit,
    created_at
FROM storage.buckets 
WHERE name IN ('company-logos', 'dashboard-logos', 'employee-photos')
ORDER BY name;

-- 6. 정책 상태 확인
SELECT 
    'Storage 정책 상태' as info,
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 7. RLS 상태 확인
SELECT 
    'RLS 상태' as info,
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage'; 