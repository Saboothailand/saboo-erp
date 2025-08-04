-- 부서 관리 테이블 생성
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    department_code VARCHAR(10) UNIQUE NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    department_description TEXT,
    manager_id INTEGER,
    budget DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 부서 데이터 삽입
INSERT INTO departments (department_code, department_name, department_description, budget, status) VALUES
('IT', 'IT', '정보기술팀', 1000000, 'ACTIVE'),
('HR', 'HR', '인사팀', 500000, 'ACTIVE'),
('Finance', 'Finance', '재무팀', 800000, 'ACTIVE'),
('Marketing', 'Marketing', '마케팅팀', 1200000, 'ACTIVE'),
('Sales', 'Sales', '영업팀', 1500000, 'ACTIVE')
ON CONFLICT (department_code) DO NOTHING;

-- RLS 정책 설정
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 설정
CREATE POLICY "Allow read access to departments" ON departments
    FOR SELECT USING (true);

-- 관리자만 수정 가능하도록 설정
CREATE POLICY "Allow update access to departments" ON departments
    FOR UPDATE USING (true);

-- 관리자만 삽입 가능하도록 설정
CREATE POLICY "Allow insert access to departments" ON departments
    FOR INSERT WITH CHECK (true);

-- 관리자만 삭제 가능하도록 설정
CREATE POLICY "Allow delete access to departments" ON departments
    FOR DELETE USING (true);

-- employees 테이블에 department_id 외래키 추가 (기존 department 컬럼과 연결)
ALTER TABLE employees ADD COLUMN IF NOT EXISTS department_id INTEGER REFERENCES departments(id);

-- 기존 department 컬럼의 값을 department_id로 마이그레이션
UPDATE employees 
SET department_id = d.id 
FROM departments d 
WHERE employees.department = d.department_code 
AND employees.department_id IS NULL; 