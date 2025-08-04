-- 대시보드 설정 테이블에 로고 관련 컬럼 추가
ALTER TABLE dashboard_settings 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS logo_text VARCHAR(100) DEFAULT '급여관리',
ADD COLUMN IF NOT EXISTS show_logo BOOLEAN DEFAULT true;

-- 기존 데이터가 있다면 기본값 업데이트
UPDATE dashboard_settings 
SET logo_text = '급여관리', show_logo = true 
WHERE logo_text IS NULL OR show_logo IS NULL;

-- RLS 정책 업데이트 (로고 관련 컬럼 포함)
DROP POLICY IF EXISTS "Enable read access for all users" ON dashboard_settings;
DROP POLICY IF EXISTS "Enable insert for all users" ON dashboard_settings;
DROP POLICY IF EXISTS "Enable update for all users" ON dashboard_settings;

CREATE POLICY "Enable read access for all users" ON dashboard_settings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON dashboard_settings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON dashboard_settings
    FOR UPDATE USING (true); 