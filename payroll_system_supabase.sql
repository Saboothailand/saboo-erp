-- 🌟 완전한 월급명세서 관리 시스템 (Supabase PostgreSQL 버전)
-- 🎯 Supabase + Next.js 연동

-- ========================================
-- 🧹 기존 테이블 정리
-- ========================================

-- 기존 테이블들 삭제 (순서 중요)
DROP TABLE IF EXISTS overtime_records CASCADE;
DROP TABLE IF EXISTS payroll_statements CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- 기존 함수들 삭제
DROP FUNCTION IF EXISTS update_payroll_overtime() CASCADE;
DROP FUNCTION IF EXISTS calculate_net_salary() CASCADE;
DROP FUNCTION IF EXISTS admin_login(text, text) CASCADE;
DROP FUNCTION IF EXISTS add_overtime_record(integer, date, time, time, text, integer, text, text) CASCADE;
DROP FUNCTION IF EXISTS approve_overtime_record(integer, integer, text, text) CASCADE;
DROP FUNCTION IF EXISTS update_employee_bonus(integer, numeric, numeric, text, integer) CASCADE;
DROP FUNCTION IF EXISTS get_monthly_payroll_summary(integer, text, text) CASCADE;
DROP FUNCTION IF EXISTS get_overtime_records(integer, text, text) CASCADE;

-- 기존 뷰들 삭제
DROP VIEW IF EXISTS payroll_summary CASCADE;

-- ========================================
-- 🏗️  데이터베이스 스키마 설계
-- ========================================

-- 1️⃣ 관리자 인증 시스템
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) DEFAULT 'HR_ADMIN' CHECK (role IN ('SUPER_ADMIN', 'HR_ADMIN', 'FINANCE_ADMIN')),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣ 직원 마스터 테이블
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_code VARCHAR(20) UNIQUE NOT NULL,
    nick_name VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    full_name_thai VARCHAR(150),
    department VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    bank_name VARCHAR(100) NOT NULL,
    bank_account VARCHAR(50) NOT NULL,
    monthly_salary DECIMAL(12,2) NOT NULL,
    hourly_rate DECIMAL(8,2) GENERATED ALWAYS AS (
        ROUND(monthly_salary / 22 / 8, 2)
    ) STORED,
    overtime_rate DECIMAL(8,2) GENERATED ALWAYS AS (
        ROUND(monthly_salary / 22 / 8 * 1.5, 2)
    ) STORED,
    social_insurance_rate DECIMAL(5,2) DEFAULT 5.00,
    tax_rate DECIMAL(5,2) DEFAULT 3.00,
    performance_rating DECIMAL(3,2) DEFAULT 3.00,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'TERMINATED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ 월급명세서 메인 테이블
CREATE TABLE payroll_statements (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    pay_year INTEGER NOT NULL,
    pay_month VARCHAR(20) NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    payment_date DATE NOT NULL,
    work_days DECIMAL(5,2) DEFAULT 22,
    actual_work_days DECIMAL(5,2) DEFAULT 22,
    base_salary DECIMAL(12,2) NOT NULL,
    hourly_rate DECIMAL(8,2) NOT NULL,
    overtime_rate DECIMAL(8,2) NOT NULL,
    position_allowance DECIMAL(10,2) DEFAULT 0,
    meal_allowance DECIMAL(10,2) DEFAULT 0,
    transport_allowance DECIMAL(10,2) DEFAULT 0,
    performance_bonus DECIMAL(10,2) DEFAULT 0,
    special_bonus DECIMAL(10,2) DEFAULT 0,
    bonus_reason VARCHAR(200),
    total_overtime_hours DECIMAL(6,2) DEFAULT 0,
    social_insurance DECIMAL(10,2) DEFAULT 0,
    personal_tax DECIMAL(10,2) DEFAULT 0,
    advance_salary DECIMAL(10,2) DEFAULT 0,
    salary_deduction DECIMAL(10,2) DEFAULT 0,
    other_deductions DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING', 'APPROVED', 'PAID')),
    created_by INTEGER NOT NULL REFERENCES admin_users(id),
    approved_by INTEGER REFERENCES admin_users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(employee_id, pay_year, pay_month)
);

-- 4️⃣ 오버타임 기록 테이블
CREATE TABLE overtime_records (
    id SERIAL PRIMARY KEY,
    payroll_id INTEGER NOT NULL REFERENCES payroll_statements(id) ON DELETE CASCADE,
    employee_id INTEGER NOT NULL REFERENCES employees(id),
    overtime_date DATE NOT NULL,
    start_time TIME DEFAULT '17:00:00',
    end_time TIME NOT NULL,
    overtime_hours DECIMAL(4,2) GENERATED ALWAYS AS (
        CASE 
            WHEN start_time < end_time THEN 
                ROUND(EXTRACT(EPOCH FROM (end_time - start_time)) / 3600, 2)
            ELSE 0 
        END
    ) STORED,
    work_description TEXT NOT NULL,
    reason VARCHAR(30) DEFAULT 'OTHER' CHECK (reason IN ('PROJECT_DEADLINE', 'URGENT_TASK', 'SYSTEM_MAINTENANCE', 'MEETING', 'OTHER')),
    priority VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status VARCHAR(10) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_by INTEGER NOT NULL REFERENCES admin_users(id),
    approved_by INTEGER REFERENCES admin_users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 🎯 샘플 데이터 생성
-- ========================================

-- 👑 기본 관리자 계정 생성 (비밀번호: admin123)
INSERT INTO admin_users (username, password_hash, full_name, email, role, department) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin@saboo.com', 'SUPER_ADMIN', 'IT'),
('hr_admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'HR Administrator', 'hr@saboo.com', 'HR_ADMIN', 'HR');

-- 👥 샘플 직원 데이터
INSERT INTO employees (
    employee_code, nick_name, full_name, full_name_thai, department, start_date, 
    bank_name, bank_account, monthly_salary, social_insurance_rate, tax_rate, performance_rating
) VALUES
('EMP001', 'ICE', 'Ice Developer', 'นางสาว วาสนาสดี่น', 'IT', '2024-01-01', 
 'K Bank', '201-8-92093-2', 25000.00, 5.00, 3.00, 4.5),
('EMP002', 'JOHN', 'John Smith', 'นาย จอห์น สมิธ', 'HR', '2024-02-01', 
 'SCB', '301-9-12345-6', 22000.00, 5.00, 3.00, 4.0),
('EMP003', 'MARY', 'Mary Johnson', 'นางสาว แมรี่ จอห์นสัน', 'Finance', '2024-03-01', 
 'Kasikorn', '401-2-67890-1', 28000.00, 5.00, 3.00, 4.8),
('EMP004', 'TOM', 'Tom Wilson', 'นาย ทอม วิลสัน', 'IT', '2024-04-01', 
 'Bangkok Bank', '501-3-11111-2', 23000.00, 5.00, 3.00, 3.8),
('EMP005', 'LISA', 'Lisa Brown', 'นางสาว ลิซ่า บราวน์', 'Marketing', '2024-05-01', 
 'TMB', '601-4-22222-3', 24000.00, 5.00, 3.00, 4.2);

-- 📊 2025년 7월 급여명세서 생성
WITH payroll_data AS (
    SELECT 
        e.id as employee_id,
        2025 as pay_year,
        'JULY' as pay_month,
        '2025-06-26'::date as pay_period_start,
        '2025-07-25'::date as pay_period_end,
        '2025-07-31'::date as payment_date,
        22 as work_days,
        22 as actual_work_days,
        e.monthly_salary as base_salary,
        e.hourly_rate,
        e.overtime_rate,
        CASE 
            WHEN e.nick_name = 'ICE' THEN 2000.00
            WHEN e.nick_name = 'MARY' THEN 3000.00
            WHEN e.nick_name = 'JOHN' THEN 1500.00
            ELSE 1000.00
        END as position_allowance,
        1500.00 as meal_allowance,
        1000.00 as transport_allowance,
        CASE 
            WHEN e.performance_rating >= 4.5 THEN 2000.00
            WHEN e.performance_rating >= 4.0 THEN 1500.00
            WHEN e.performance_rating >= 3.5 THEN 1000.00
            ELSE 0
        END as performance_bonus,
        CASE 
            WHEN e.nick_name = 'ICE' THEN 2000.00
            WHEN e.nick_name = 'MARY' THEN 3000.00
            ELSE 0
        END as special_bonus,
        CASE 
            WHEN e.nick_name = 'ICE' THEN '프로젝트 완료 특별 보너스'
            WHEN e.nick_name = 'MARY' THEN '우수사원 특별 보너스'
            ELSE NULL
        END as bonus_reason,
        ROUND(e.monthly_salary * e.social_insurance_rate / 100, 2) as social_insurance,
        ROUND(e.monthly_salary * e.tax_rate / 100, 2) as personal_tax,
        1 as created_by
    FROM employees e 
    WHERE e.status = 'ACTIVE'
)
INSERT INTO payroll_statements (
    employee_id, pay_year, pay_month, pay_period_start, pay_period_end, payment_date,
    work_days, actual_work_days, base_salary, hourly_rate, overtime_rate,
    position_allowance, meal_allowance, transport_allowance,
    performance_bonus, special_bonus, bonus_reason,
    social_insurance, personal_tax, created_by
)
SELECT * FROM payroll_data;

-- ⏰ 샘플 오버타임 데이터
INSERT INTO overtime_records (payroll_id, employee_id, overtime_date, start_time, end_time, work_description, reason, priority, created_by) VALUES
(1, 1, '2025-07-15', '17:00:00', '19:30:00', '프로젝트 마감 작업', 'PROJECT_DEADLINE', 'HIGH', 1),
(1, 1, '2025-07-20', '17:00:00', '18:00:00', '시스템 점검', 'SYSTEM_MAINTENANCE', 'MEDIUM', 1),
(2, 2, '2025-07-10', '17:00:00', '18:30:00', '인사 업무 처리', 'URGENT_TASK', 'MEDIUM', 1),
(3, 3, '2025-07-12', '17:00:00', '20:00:00', '재무 보고서 작성', 'URGENT_TASK', 'HIGH', 1);

-- ========================================
-- 🔧 PostgreSQL 함수 생성
-- ========================================

-- 1️⃣ 오버타임 총 시간 업데이트 함수
CREATE OR REPLACE FUNCTION update_payroll_overtime()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE payroll_statements 
    SET total_overtime_hours = (
        SELECT COALESCE(SUM(overtime_hours), 0)
        FROM overtime_records 
        WHERE payroll_id = NEW.payroll_id 
          AND status = 'APPROVED'
    )
    WHERE id = NEW.payroll_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_update_overtime
    AFTER INSERT OR UPDATE ON overtime_records
    FOR EACH ROW
    EXECUTE FUNCTION update_payroll_overtime();

-- 2️⃣ 관리자 로그인 함수
CREATE OR REPLACE FUNCTION admin_login(p_username text, p_password text)
RETURNS TABLE(
    user_id integer,
    username text,
    full_name text,
    role text,
    department text,
    is_valid boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        au.id,
        au.username,
        au.full_name,
        au.role,
        au.department,
        CASE WHEN au.password_hash = p_password THEN true ELSE false END as is_valid
    FROM admin_users au
    WHERE au.username = p_username AND au.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- 3️⃣ 오버타임 등록 함수
CREATE OR REPLACE FUNCTION add_overtime_record(
    p_employee_id integer,
    p_overtime_date date,
    p_start_time time,
    p_end_time time,
    p_work_description text,
    p_created_by integer,              -- 기본값 없는 매개변수를 먼저
    p_reason text DEFAULT 'OTHER',     -- 기본값 있는 매개변수를 나중에
    p_priority text DEFAULT 'MEDIUM'   -- 기본값 있는 매개변수를 나중에
)
RETURNS integer AS $$
DECLARE
    v_payroll_id integer;
    v_overtime_id integer;
BEGIN
    -- 해당 월의 급여명세서 찾기
    SELECT id INTO v_payroll_id
    FROM payroll_statements
    WHERE employee_id = p_employee_id
      AND pay_year = EXTRACT(YEAR FROM p_overtime_date)
      AND pay_month = CASE 
          WHEN EXTRACT(MONTH FROM p_overtime_date) = 1 THEN 'JANUARY'
          WHEN EXTRACT(MONTH FROM p_overtime_date) = 2 THEN 'FEBRUARY'
          WHEN EXTRACT(MONTH FROM p_overtime_date) = 3 THEN 'MARCH'
          WHEN EXTRACT(MONTH FROM p_overtime_date) = 4 THEN 'APRIL'
          WHEN EXTRACT(MONTH FROM p_overtime_date) = 5 THEN 'MAY'
          WHEN EXTRACT(MONTH FROM p_overtime_date) = 6 THEN 'JUNE'
          WHEN EXTRACT(MONTH FROM p_overtime_date) = 7 THEN 'JULY'
          WHEN EXTRACT(MONTH FROM p_overtime_date) = 8 THEN 'AUGUST'
          WHEN EXTRACT(MONTH FROM p_overtime_date) = 9 THEN 'SEPTEMBER'
          WHEN EXTRACT(MONTH FROM p_overtime_date) = 10 THEN 'OCTOBER'
          WHEN EXTRACT(MONTH FROM p_overtime_date) = 11 THEN 'NOVEMBER'
          WHEN EXTRACT(MONTH FROM p_overtime_date) = 12 THEN 'DECEMBER'
      END;
    
    IF v_payroll_id IS NULL THEN
        RAISE EXCEPTION '해당 월의 급여명세서가 존재하지 않습니다.';
    END IF;
    
    -- 오버타임 기록 추가
    INSERT INTO overtime_records (
        payroll_id, employee_id, overtime_date, start_time, end_time,
        work_description, reason, priority, created_by
    ) VALUES (
        v_payroll_id, p_employee_id, p_overtime_date, p_start_time, p_end_time,
        p_work_description, p_reason, p_priority, p_created_by
    ) RETURNING id INTO v_overtime_id;
    
    RETURN v_overtime_id;
END;
$$ LANGUAGE plpgsql;

-- 4️⃣ 오버타임 승인/거부 함수
CREATE OR REPLACE FUNCTION approve_overtime_record(
    p_overtime_id integer,
    p_admin_id integer,
    p_status text,
    p_rejection_reason text DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
    UPDATE overtime_records 
    SET 
        status = p_status,
        approved_by = p_admin_id,
        approved_at = CURRENT_TIMESTAMP,
        rejection_reason = p_rejection_reason
    WHERE id = p_overtime_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- 5️⃣ 보너스 업데이트 함수
CREATE OR REPLACE FUNCTION update_employee_bonus(
    p_employee_id integer,
    p_performance_bonus numeric,
    p_special_bonus numeric,
    p_bonus_reason text,
    p_admin_id integer
)
RETURNS boolean AS $$
BEGIN
    UPDATE payroll_statements 
    SET 
        performance_bonus = p_performance_bonus,
        special_bonus = p_special_bonus,
        bonus_reason = p_bonus_reason
    WHERE employee_id = p_employee_id
      AND pay_year = EXTRACT(YEAR FROM CURRENT_DATE)
      AND pay_month = CASE 
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 1 THEN 'JANUARY'
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 2 THEN 'FEBRUARY'
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 3 THEN 'MARCH'
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 4 THEN 'APRIL'
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 5 THEN 'MAY'
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 6 THEN 'JUNE'
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 7 THEN 'JULY'
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 8 THEN 'AUGUST'
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 9 THEN 'SEPTEMBER'
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 10 THEN 'OCTOBER'
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 11 THEN 'NOVEMBER'
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 12 THEN 'DECEMBER'
      END;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- 6️⃣ 월간 급여 현황 조회 함수
CREATE OR REPLACE FUNCTION get_monthly_payroll_summary(
    p_year integer,
    p_month text,
    p_department text DEFAULT NULL
)
RETURNS TABLE(
    employee_code text,
    department text,
    nick_name text,
    full_name text,
    base_salary numeric,
    total_allowances numeric,
    overtime_hours numeric,
    overtime_pay numeric,
    total_bonus numeric,
    gross_salary numeric,
    total_deductions numeric,
    net_salary numeric,
    status text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.employee_code,
        e.department,
        e.nick_name,
        e.full_name,
        ps.base_salary,
        (ps.position_allowance + ps.meal_allowance + ps.transport_allowance) as total_allowances,
        ps.total_overtime_hours,
        (ps.total_overtime_hours * ps.overtime_rate) as overtime_pay,
        (ps.performance_bonus + ps.special_bonus) as total_bonus,
        (ps.base_salary + (ps.total_overtime_hours * ps.overtime_rate) + ps.performance_bonus + ps.special_bonus + ps.position_allowance + ps.meal_allowance + ps.transport_allowance) as gross_salary,
        (ps.social_insurance + ps.personal_tax + ps.advance_salary + ps.salary_deduction + ps.other_deductions) as total_deductions,
        (ps.base_salary + (ps.total_overtime_hours * ps.overtime_rate) + ps.performance_bonus + ps.special_bonus + ps.position_allowance + ps.meal_allowance + ps.transport_allowance - ps.social_insurance - ps.personal_tax - ps.advance_salary - ps.salary_deduction - ps.other_deductions) as net_salary,
        ps.status
    FROM payroll_statements ps
    JOIN employees e ON ps.employee_id = e.id
    WHERE ps.pay_year = p_year 
      AND ps.pay_month = p_month
      AND (p_department IS NULL OR e.department = p_department)
    ORDER BY e.department, e.employee_code;
END;
$$ LANGUAGE plpgsql;

-- 7️⃣ 오버타임 현황 조회 함수
CREATE OR REPLACE FUNCTION get_overtime_records(
    p_year integer,
    p_month text,
    p_status text DEFAULT 'ALL'
)
RETURNS TABLE(
    employee_code text,
    nick_name text,
    department text,
    overtime_date date,
    start_time time,
    end_time time,
    overtime_hours numeric,
    work_description text,
    reason text,
    priority text,
    status text,
    created_at timestamp
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.employee_code,
        e.nick_name,
        e.department,
        ot.overtime_date,
        ot.start_time,
        ot.end_time,
        ot.overtime_hours,
        ot.work_description,
        ot.reason,
        ot.priority,
        ot.status,
        ot.created_at
    FROM overtime_records ot
    JOIN employees e ON ot.employee_id = e.id
    JOIN payroll_statements ps ON ot.payroll_id = ps.id
    WHERE ps.pay_year = p_year 
      AND ps.pay_month = p_month
      AND (p_status = 'ALL' OR ot.status = p_status)
    ORDER BY ot.overtime_date DESC, ot.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 🎯 확인용 뷰 생성
-- ========================================

-- 📊 급여 현황 뷰
CREATE VIEW payroll_summary AS
SELECT 
    e.employee_code,
    e.department,
    e.nick_name,
    e.full_name,
    ps.pay_year,
    ps.pay_month,
    ps.base_salary,
    (ps.position_allowance + ps.meal_allowance + ps.transport_allowance) as total_allowances,
    ps.total_overtime_hours,
    (ps.total_overtime_hours * ps.overtime_rate) as overtime_pay,
    (ps.performance_bonus + ps.special_bonus) as total_bonus,
    (ps.base_salary + (ps.total_overtime_hours * ps.overtime_rate) + ps.performance_bonus + ps.special_bonus + ps.position_allowance + ps.meal_allowance + ps.transport_allowance) as gross_salary,
    (ps.social_insurance + ps.personal_tax + ps.advance_salary + ps.salary_deduction + ps.other_deductions) as total_deductions,
    (ps.base_salary + (ps.total_overtime_hours * ps.overtime_rate) + ps.performance_bonus + ps.special_bonus + ps.position_allowance + ps.meal_allowance + ps.transport_allowance - ps.social_insurance - ps.personal_tax - ps.advance_salary - ps.salary_deduction - ps.other_deductions) as net_salary,
    ps.status,
    ps.created_at
FROM payroll_statements ps
JOIN employees e ON ps.employee_id = e.id;

-- ========================================
-- 🔐 Row Level Security 설정 (Supabase)
-- ========================================

-- RLS 활성화
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE overtime_records ENABLE ROW LEVEL SECURITY;

-- 관리자 정책 (모든 접근 허용)
CREATE POLICY "Admin users can do everything" ON admin_users FOR ALL USING (true);
CREATE POLICY "Employees can be viewed by all" ON employees FOR SELECT USING (true);
CREATE POLICY "Payroll statements can be viewed by all" ON payroll_statements FOR SELECT USING (true);
CREATE POLICY "Overtime records can be viewed by all" ON overtime_records FOR SELECT USING (true);

-- ========================================
-- 🎯 확인용 쿼리
-- ========================================

-- 📊 전체 급여 현황 조회
SELECT 
    e.employee_code,
    e.department,
    e.nick_name,
    e.full_name,
    ps.pay_year,
    ps.pay_month,
    ps.base_salary,
    (ps.position_allowance + ps.meal_allowance + ps.transport_allowance) as total_allowances,
    ps.total_overtime_hours,
    (ps.total_overtime_hours * ps.overtime_rate) as overtime_pay,
    (ps.performance_bonus + ps.special_bonus) as total_bonus,
    (ps.base_salary + (ps.total_overtime_hours * ps.overtime_rate) + ps.performance_bonus + ps.special_bonus + ps.position_allowance + ps.meal_allowance + ps.transport_allowance) as gross_salary,
    (ps.social_insurance + ps.personal_tax + ps.advance_salary + ps.salary_deduction + ps.other_deductions) as total_deductions,
    (ps.base_salary + (ps.total_overtime_hours * ps.overtime_rate) + ps.performance_bonus + ps.special_bonus + ps.position_allowance + ps.meal_allowance + ps.transport_allowance - ps.social_insurance - ps.personal_tax - ps.advance_salary - ps.salary_deduction - ps.other_deductions) as net_salary,
    ps.status
FROM payroll_statements ps
JOIN employees e ON ps.employee_id = e.id
WHERE ps.pay_year = 2025 AND ps.pay_month = 'JULY'
ORDER BY e.department, e.employee_code; 