-- company_settings 테이블 문제 해결
-- Supabase SQL Editor에서 실행하세요

-- 1. company_settings 테이블이 존재하는지 확인하고 없으면 생성
CREATE TABLE IF NOT EXISTS company_settings (
  id SERIAL PRIMARY KEY,
  company_name TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  logo_filename TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 기본 데이터 삽입 (테이블이 비어있는 경우)
INSERT INTO company_settings (id, company_name, address, phone, email, website, logo_url, logo_filename)
VALUES (
  1,
  'Saboo (Thailand) Co.,Ltd',
  '55/20 MOO 4, TAMBON BUNG KHAM PROY, AMPHUR LAM LUK KA, PATHUM THANI 12150 THAILAND',
  'TEL. 02-159-9880',
  'hr@saboo.co.th',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS 비활성화 (임시로)
ALTER TABLE company_settings DISABLE ROW LEVEL SECURITY;

-- 4. 또는 RLS 정책 생성 (더 안전한 방법)
-- ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Enable all access for company_settings" ON company_settings;
-- CREATE POLICY "Enable all access for company_settings" ON company_settings FOR ALL USING (true);

-- 5. updated_at 트리거 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_company_settings_updated_at ON company_settings;
CREATE TRIGGER update_company_settings_updated_at
    BEFORE UPDATE ON company_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 