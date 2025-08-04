-- 대시보드 설정 테이블 생성
CREATE TABLE IF NOT EXISTS dashboard_settings (
    id SERIAL PRIMARY KEY,
    show_welcome_message BOOLEAN DEFAULT true,
    welcome_message TEXT DEFAULT '안녕하세요! 급여 관리 시스템에 오신 것을 환영합니다.',
    default_view VARCHAR(50) DEFAULT 'dashboard',
    refresh_interval INTEGER DEFAULT 300,
    show_notifications BOOLEAN DEFAULT true,
    show_quick_actions BOOLEAN DEFAULT true,
    show_recent_activity BOOLEAN DEFAULT true,
    show_statistics BOOLEAN DEFAULT true,
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'ko',
    date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
    currency VARCHAR(10) DEFAULT 'KRW',
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 설정 데이터 삽입
INSERT INTO dashboard_settings (id, show_welcome_message, welcome_message, default_view, refresh_interval, show_notifications, show_quick_actions, show_recent_activity, show_statistics, theme, language, date_format, currency, timezone)
VALUES (1, true, '안녕하세요! 급여 관리 시스템에 오신 것을 환영합니다.', 'dashboard', 300, true, true, true, true, 'light', 'ko', 'YYYY-MM-DD', 'KRW', 'Asia/Seoul')
ON CONFLICT (id) DO NOTHING;

-- RLS 정책 설정
ALTER TABLE dashboard_settings ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 설정
CREATE POLICY "Allow read access to dashboard_settings" ON dashboard_settings
    FOR SELECT USING (true);

-- 관리자만 수정 가능하도록 설정
CREATE POLICY "Allow update access to dashboard_settings" ON dashboard_settings
    FOR UPDATE USING (true);

-- 관리자만 삽입 가능하도록 설정
CREATE POLICY "Allow insert access to dashboard_settings" ON dashboard_settings
    FOR INSERT WITH CHECK (true);

-- updated_at 자동 업데이트를 위한 트리거
CREATE OR REPLACE FUNCTION update_dashboard_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dashboard_settings_updated_at
    BEFORE UPDATE ON dashboard_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_dashboard_settings_updated_at(); 