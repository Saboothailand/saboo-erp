-- 🚀 새로운 버킷 이름으로 업데이트
-- Supabase SQL Editor에서 실행하세요

-- 1. 회사 설정 테이블 업데이트 (새로운 버킷 이름 사용)
UPDATE company_settings 
SET 
    logo_url = 'https://utesnkxljuxcgitlcizr.supabase.co/storage/v1/object/public/company-logo/test-1754410258097-thai-kim.png',
    logo_filename = 'test-1754410258097-thai-kim.png'
WHERE id = 1;

-- 2. 대시보드 설정 테이블 업데이트
UPDATE dashboard_settings 
SET 
    logo_url = 'https://utesnkxljuxcgitlcizr.supabase.co/storage/v1/object/public/dashboard-logo/test-1754410258097-thai-kim.png',
    logo_filename = 'test-1754410258097-thai-kim.png'
WHERE id = 1;

-- 3. 결과 확인
SELECT '✅ 새로운 버킷 이름으로 업데이트 완료!' as status;
SELECT * FROM company_settings;
SELECT * FROM dashboard_settings; 