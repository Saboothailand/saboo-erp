-- Storage 버킷 RLS 정책 수정
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 정책 삭제
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- 2. 모든 사용자에게 완전한 접근 권한 부여
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (true);

CREATE POLICY "Public Upload" ON storage.objects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Update" ON storage.objects
    FOR UPDATE USING (true);

CREATE POLICY "Public Delete" ON storage.objects
    FOR DELETE USING (true);

-- 3. 버킷 존재 확인 및 생성
-- company-logos 버킷
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'company-logos',
    'company-logos',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- dashboard-logos 버킷
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'dashboard-logos',
    'dashboard-logos',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 4. 버킷 상태 확인
SELECT 
    id,
    name,
    public,
    file_size_limit,
    created_at
FROM storage.buckets 
WHERE name IN ('company-logos', 'dashboard-logos'); 