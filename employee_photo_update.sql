-- 직원 테이블에 사진 관련 필드 추가
ALTER TABLE employees ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS photo_filename VARCHAR(255);

-- 기존 직원들의 기본 사진 URL 설정 (선택사항)
-- UPDATE employees SET photo_url = NULL WHERE photo_url IS NULL; 