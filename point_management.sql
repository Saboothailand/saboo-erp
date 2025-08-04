-- 포인트 관리 테이블 생성
CREATE TABLE IF NOT EXISTS point_records (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id),
    point_date DATE NOT NULL,
    point_type VARCHAR(50) NOT NULL, -- 'BONUS' (가산점), 'PENALTY' (감점)
    point_amount INTEGER NOT NULL, -- 양수: 가산점, 음수: 감점
    point_reason VARCHAR(100) NOT NULL, -- 포인트 지급/차감 사유
    description TEXT, -- 상세 설명
    category VARCHAR(50) NOT NULL, -- 'PERFORMANCE', 'ATTENDANCE', 'TEAMWORK', 'INNOVATION', 'OTHER'
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    created_by INTEGER, -- 포인트를 부여한 관리자
    approved_by INTEGER, -- 승인한 관리자
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 포인트 카테고리 데이터 삽입 (선택사항)
-- INSERT INTO point_categories (category_name, description) VALUES
-- ('PERFORMANCE', '업무 성과'),
-- ('ATTENDANCE', '출근/근태'),
-- ('TEAMWORK', '팀워크/협력'),
-- ('INNOVATION', '혁신/아이디어'),
-- ('OTHER', '기타');

-- RLS 정책 설정
ALTER TABLE point_records ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 설정
CREATE POLICY "Allow read access to point_records" ON point_records
    FOR SELECT USING (true);

-- 관리자만 수정 가능하도록 설정
CREATE POLICY "Allow update access to point_records" ON point_records
    FOR UPDATE USING (true);

-- 관리자만 삽입 가능하도록 설정
CREATE POLICY "Allow insert access to point_records" ON point_records
    FOR INSERT WITH CHECK (true);

-- 관리자만 삭제 가능하도록 설정
CREATE POLICY "Allow delete access to point_records" ON point_records
    FOR DELETE USING (true);

-- 포인트 합계를 쉽게 조회할 수 있는 뷰 생성
CREATE OR REPLACE VIEW employee_point_summary AS
SELECT 
    e.id as employee_id,
    e.employee_code,
    e.nick_name,
    e.full_name,
    e.department,
    COALESCE(SUM(pr.point_amount), 0) as total_points,
    COALESCE(SUM(CASE WHEN pr.point_amount > 0 THEN pr.point_amount ELSE 0 END), 0) as bonus_points,
    COALESCE(SUM(CASE WHEN pr.point_amount < 0 THEN ABS(pr.point_amount) ELSE 0 END), 0) as penalty_points,
    COUNT(pr.id) as total_records
FROM employees e
LEFT JOIN point_records pr ON e.id = pr.employee_id AND pr.status = 'APPROVED'
WHERE e.status = 'ACTIVE'
GROUP BY e.id, e.employee_code, e.nick_name, e.full_name, e.department;

-- 인덱스 생성 (성능 향상)
CREATE INDEX idx_point_records_employee_id ON point_records(employee_id);
CREATE INDEX idx_point_records_date ON point_records(point_date);
CREATE INDEX idx_point_records_status ON point_records(status);
CREATE INDEX idx_point_records_category ON point_records(category); 