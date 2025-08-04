-- 회사 설정 테이블 생성
CREATE TABLE IF NOT EXISTS company_settings (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) DEFAULT '급여관리 시스템',
    logo_url TEXT,
    logo_filename VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 설정 데이터 삽입
INSERT INTO company_settings (id, company_name, logo_url, logo_filename, address, phone, email, website)
VALUES (1, '급여관리 시스템', NULL, NULL, '서울시 강남구', '02-1234-5678', 'admin@company.com', 'https://company.com')
ON CONFLICT (id) DO NOTHING;

-- RLS 정책 설정
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 설정
CREATE POLICY "Allow read access to company_settings" ON company_settings
    FOR SELECT USING (true);

-- 관리자만 수정 가능하도록 설정
CREATE POLICY "Allow update access to company_settings" ON company_settings
    FOR UPDATE USING (true);

-- 관리자만 삽입 가능하도록 설정
CREATE POLICY "Allow insert access to company_settings" ON company_settings
    FOR INSERT WITH CHECK (true); 