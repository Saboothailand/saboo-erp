-- 🚀 테이블 구조 확인 및 수정 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 테이블 구조 확인
SELECT '기존 company_settings 테이블 구조:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'company_settings' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. 기존 테이블 삭제 (있다면)
DROP TABLE IF EXISTS company_settings CASCADE;

-- 3. 올바른 구조로 테이블 재생성
CREATE TABLE company_settings (
    id SERIAL PRIMARY KEY,
    company_name TEXT,
    address TEXT,  -- company_address 대신 address 사용
    phone TEXT,    -- phone_number 대신 phone 사용
    email TEXT,
    website TEXT,  -- website_url 대신 website 사용
    logo_url TEXT,
    logo_filename TEXT,
    dashboard_logo_url TEXT,
    dashboard_logo_filename TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 대시보드 설정 테이블 생성
CREATE TABLE IF NOT EXISTS dashboard_settings (
    id SERIAL PRIMARY KEY,
    default_screen TEXT DEFAULT 'dashboard',
    theme TEXT DEFAULT 'light',
    logo_url TEXT,
    logo_filename TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 직원 테이블에 사진 관련 컬럼 추가
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS photo_filename TEXT;

-- 6. 기본 데이터 삽입 (올바른 컬럼명 사용)
INSERT INTO company_settings (company_name, address, phone, email, website)
VALUES ('Saboo Thailand', 'Bangkok, Thailand', '+66-2-123-4567', 'info@saboothailand.com', 'https://saboothailand.com');

INSERT INTO dashboard_settings (default_screen, theme)
VALUES ('dashboard', 'light')
ON CONFLICT DO NOTHING;

-- 7. 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. 트리거 생성
DROP TRIGGER IF EXISTS update_company_settings_updated_at ON company_settings;
CREATE TRIGGER update_company_settings_updated_at
    BEFORE UPDATE ON company_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dashboard_settings_updated_at ON dashboard_settings;
CREATE TRIGGER update_dashboard_settings_updated_at
    BEFORE UPDATE ON dashboard_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. 테스트용 파일 정보 추가
UPDATE company_settings 
SET 
    logo_url = 'https://utesnkxljuxcgitlcizr.supabase.co/storage/v1/object/public/company-logos/test-1754410258097-thai-kim.png',
    logo_filename = 'test-1754410258097-thai-kim.png'
WHERE id = 1;

-- 10. 결과 확인
SELECT '✅ 테이블 생성 완료!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('employees', 'company_settings', 'dashboard_settings');

SELECT '✅ company_settings 데이터 확인:' as info;
SELECT * FROM company_settings;

SELECT '✅ 컬럼 구조 확인:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'company_settings' ORDER BY ordinal_position; 