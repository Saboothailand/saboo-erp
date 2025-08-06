-- 🚀 Storage 권한 문제 해결 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 Storage 정책만 삭제 (테이블 삭제하지 않음)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view files" ON storage.objects;

-- 2. Storage 버킷 생성 (기존 버킷이 있으면 업데이트)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('company-logos', 'company-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('dashboard-logos', 'dashboard-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('employee-photos', 'employee-photos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- 3. 안전한 Storage 정책 생성
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (true);

CREATE POLICY "Public Upload" ON storage.objects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Update" ON storage.objects
    FOR UPDATE USING (true);

CREATE POLICY "Public Delete" ON storage.objects
    FOR DELETE USING (true);

-- 4. 직원 테이블에 사진 관련 컬럼 추가
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS photo_filename TEXT;

-- 5. 회사 설정 테이블 생성
CREATE TABLE IF NOT EXISTS company_settings (
    id SERIAL PRIMARY KEY,
    company_name TEXT,
    company_address TEXT,
    phone_number TEXT,
    email TEXT,
    website_url TEXT,
    logo_url TEXT,
    logo_filename TEXT,
    dashboard_logo_url TEXT,
    dashboard_logo_filename TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 대시보드 설정 테이블 생성
CREATE TABLE IF NOT EXISTS dashboard_settings (
    id SERIAL PRIMARY KEY,
    default_screen TEXT DEFAULT 'dashboard',
    theme TEXT DEFAULT 'light',
    logo_url TEXT,
    logo_filename TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 기본 데이터 삽입
INSERT INTO company_settings (company_name, company_address, phone_number, email, website_url)
VALUES ('Saboo Thailand', 'Bangkok, Thailand', '+66-2-123-4567', 'info@saboothailand.com', 'https://saboothailand.com')
ON CONFLICT DO NOTHING;

INSERT INTO dashboard_settings (default_screen, theme)
VALUES ('dashboard', 'light')
ON CONFLICT DO NOTHING;

-- 8. 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. 트리거 생성
DROP TRIGGER IF EXISTS update_company_settings_updated_at ON company_settings;
CREATE TRIGGER update_company_settings_updated_at
    BEFORE UPDATE ON company_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dashboard_settings_updated_at ON dashboard_settings;
CREATE TRIGGER update_dashboard_settings_updated_at
    BEFORE UPDATE ON dashboard_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. 결과 확인
SELECT '✅ Storage 버킷 생성 완료!' as status;
SELECT name, public, file_size_limit FROM storage.buckets WHERE name IN ('company-logos', 'dashboard-logos', 'employee-photos');

SELECT '✅ 테이블 생성 완료!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('employees', 'company_settings', 'dashboard_settings');

SELECT '✅ 정책 설정 완료!' as status;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage'; 