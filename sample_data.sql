-- 🌟 샘플 데이터 추가 (Supabase SQL Editor에서 실행)

-- 1️⃣ 관리자 계정 추가 (중복 방지)
INSERT INTO admin_users (username, password_hash, full_name, role, is_active) 
SELECT 'admin', '$2a$10$rQZ8K9mN2pL1vX3yJ6hF8t', '시스템 관리자', 'SUPER_ADMIN', true
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'admin');

INSERT INTO admin_users (username, password_hash, full_name, role, is_active) 
SELECT 'hr_admin', '$2a$10$rQZ8K9mN2pL1vX3yJ6hF8t', 'HR 관리자', 'HR_ADMIN', true
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'hr_admin');

INSERT INTO admin_users (username, password_hash, full_name, role, is_active) 
SELECT 'finance_admin', '$2a$10$rQZ8K9mN2pL1vX3yJ6hF8t', '재무 관리자', 'FINANCE_ADMIN', true
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'finance_admin');

-- 2️⃣ 직원 데이터 추가 (중복 방지)
INSERT INTO employees (employee_code, nick_name, full_name, full_name_thai, department, start_date, bank_name, bank_account, monthly_salary, performance_rating, status) 
SELECT 'EMP001', 'ICE', '아이스 김', 'ไอซ์ คิม', 'IT', '2024-01-15', 'KB국민은행', '123-456-789012', 25000, 4.5, 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE employee_code = 'EMP001');

INSERT INTO employees (employee_code, nick_name, full_name, full_name_thai, department, start_date, bank_name, bank_account, monthly_salary, performance_rating, status) 
SELECT 'EMP002', 'JOHN', '존 리', 'จอห์น ลี', 'HR', '2024-02-01', '신한은행', '110-123-456789', 22000, 4.0, 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE employee_code = 'EMP002');

INSERT INTO employees (employee_code, nick_name, full_name, full_name_thai, department, start_date, bank_name, bank_account, monthly_salary, performance_rating, status) 
SELECT 'EMP003', 'MARY', '메리 박', 'แมรี่ ปาร์ค', 'Finance', '2024-01-20', '우리은행', '1002-123-456789', 28000, 4.8, 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE employee_code = 'EMP003');

INSERT INTO employees (employee_code, nick_name, full_name, full_name_thai, department, start_date, bank_name, bank_account, monthly_salary, performance_rating, status) 
SELECT 'EMP004', 'TOM', '톰 최', 'ทอม ชเว', 'IT', '2024-03-01', '하나은행', '123-456-789012', 23000, 3.8, 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE employee_code = 'EMP004');

INSERT INTO employees (employee_code, nick_name, full_name, full_name_thai, department, start_date, bank_name, bank_account, monthly_salary, performance_rating, status) 
SELECT 'EMP005', 'LISA', '리사 정', 'ลิซ่า จอง', 'Marketing', '2024-02-15', '기업은행', '123-456-789012', 24000, 4.2, 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE employee_code = 'EMP005');

-- 3️⃣ 2025년 7월 급여명세서 생성 (중복 방지)
INSERT INTO payroll_statements (
    employee_id, pay_year, pay_month, pay_period_start, pay_period_end, payment_date,
    work_days, actual_work_days, base_salary, hourly_rate, overtime_rate,
    position_allowance, meal_allowance, transport_allowance, created_by
) 
SELECT 
    e.id,
    2025,
    'JULY',
    '2025-06-26',
    '2025-07-25',
    '2025-07-31',
    22,
    22,
    e.monthly_salary,
    e.hourly_rate,
    e.overtime_rate,
    CASE 
        WHEN e.department = 'IT' THEN 2000.00
        WHEN e.department = 'HR' THEN 1500.00
        WHEN e.department = 'Finance' THEN 2500.00
        WHEN e.department = 'Marketing' THEN 1800.00
        ELSE 1000.00
    END as position_allowance,
    1500.00 as meal_allowance,
    1000.00 as transport_allowance,
    1 as created_by
FROM employees e 
WHERE e.status = 'ACTIVE'
AND NOT EXISTS (
    SELECT 1 FROM payroll_statements ps 
    WHERE ps.employee_id = e.id 
    AND ps.pay_year = 2025 
    AND ps.pay_month = 'JULY'
);

-- 4️⃣ 샘플 오버타임 데이터 추가
INSERT INTO overtime_records (
    payroll_id, employee_id, overtime_date, start_time, end_time,
    work_description, reason, priority, status, created_by
)
SELECT 
    ps.id,
    ps.employee_id,
    '2025-07-15',
    '17:00:00',
    '19:30:00',
    '프로젝트 마감 작업',
    'PROJECT_DEADLINE',
    'HIGH',
    'APPROVED',
    1
FROM payroll_statements ps
WHERE ps.pay_year = 2025 AND ps.pay_month = 'JULY'
LIMIT 3;

-- 5️⃣ 추가 오버타임 데이터
INSERT INTO overtime_records (
    payroll_id, employee_id, overtime_date, start_time, end_time,
    work_description, reason, priority, status, created_by
)
SELECT 
    ps.id,
    ps.employee_id,
    '2025-07-20',
    '18:00:00',
    '20:00:00',
    '시스템 유지보수',
    'SYSTEM_MAINTENANCE',
    'MEDIUM',
    'PENDING',
    1
FROM payroll_statements ps
WHERE ps.pay_year = 2025 AND ps.pay_month = 'JULY'
LIMIT 2;

-- 6️⃣ 보너스 데이터 추가
UPDATE payroll_statements 
SET 
    performance_bonus = CASE 
        WHEN employee_id = 1 THEN 1500.00
        WHEN employee_id = 2 THEN 1200.00
        WHEN employee_id = 3 THEN 1800.00
        WHEN employee_id = 4 THEN 1000.00
        WHEN employee_id = 5 THEN 1300.00
    END,
    special_bonus = CASE 
        WHEN employee_id = 1 THEN 2000.00
        WHEN employee_id = 3 THEN 2500.00
        ELSE 0.00
    END,
    bonus_reason = CASE 
        WHEN employee_id = 1 THEN '프로젝트 완료 특별 보너스'
        WHEN employee_id = 3 THEN '우수 성과 특별 보너스'
        ELSE NULL
    END
WHERE pay_year = 2025 AND pay_month = 'JULY';

-- 7️⃣ 확인용 쿼리
SELECT '직원 수' as info, COUNT(*) as count FROM employees WHERE status = 'ACTIVE'
UNION ALL
SELECT '급여명세서 수', COUNT(*) FROM payroll_statements WHERE pay_year = 2025 AND pay_month = 'JULY'
UNION ALL
SELECT '오버타임 기록 수', COUNT(*) FROM overtime_records; 