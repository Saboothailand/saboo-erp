-- employees 테이블에 필요한 모든 컬럼 추가
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS photo_filename TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 기존 데이터에 대한 기본값 설정
UPDATE employees 
SET photo_url = NULL, 
    photo_filename = NULL,
    created_at = NOW(),
    updated_at = NOW()
WHERE photo_url IS NULL AND photo_filename IS NULL;

-- updated_at 컬럼에 자동 업데이트 트리거 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거가 이미 존재하지 않는 경우에만 생성
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 컬럼이 제대로 추가되었는지 확인
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'employees' 
AND column_name IN ('photo_url', 'photo_filename', 'created_at', 'updated_at'); 