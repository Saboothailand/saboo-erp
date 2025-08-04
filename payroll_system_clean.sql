-- 🌟 완전한 월급명세서 관리 시스템 (깨끗한 버전)
-- 🎯 Railway MySQL + TablePlus 연동

-- ========================================
-- 🧹 기존 테이블 정리
-- ========================================

-- 기존 테이블들 삭제 (순서 중요)
DROP TABLE IF EXISTS overtime_records;
DROP TABLE IF EXISTS payroll_statements;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS admin_users;

-- ========================================
-- 🏗️  데이터베이스 스키마 설계
-- ========================================

-- 1️⃣ 관리자 인증 시스템
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role ENUM('SUPER_ADMIN', 'HR_ADMIN', 'FINANCE_ADMIN') DEFAULT 'HR_ADMIN',
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣ 직원 마스터 테이블
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(20) UNIQUE NOT NULL,
    nick_name VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    full_name_thai VARCHAR(150),
    department VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL COMMENT '입사일',
    end_date DATE NULL COMMENT '퇴사일',
    bank_name VARCHAR(100) NOT NULL,
    bank_account VARCHAR(50) NOT NULL,
    monthly_salary DECIMAL(12,2) NOT NULL COMMENT '월 기본급',
    hourly_rate DECIMAL(8,2) GENERATED ALWAYS AS (
        ROUND(monthly_salary / 22 / 9, 2)
    ) STORED COMMENT '시급 (월급÷22일÷9시간)',
    overtime_rate DECIMAL(8,2) GENERATED ALWAYS AS (
        ROUND(monthly_salary / 22 / 9 * 1.5, 2)
    ) STORED COMMENT '오버타임 시급 (시급 × 1.5배)',
    social_insurance_rate DECIMAL(5,2) DEFAULT 5.00 COMMENT '사회보험료율 (%)',
    tax_rate DECIMAL(5,2) DEFAULT 3.00 COMMENT '세율 (%)',
    performance_rating DECIMAL(3,2) DEFAULT 3.00 COMMENT '성과 평가 (1.0-5.0)',
    status ENUM('ACTIVE', 'INACTIVE', 'TERMINATED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ 월급명세서 메인 테이블
CREATE TABLE payroll_statements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    pay_year INT NOT NULL,
    pay_month VARCHAR(20) NOT NULL,
    pay_period_start DATE NOT NULL COMMENT '급여 계산 시작일 (전월 26일)',
    pay_period_end DATE NOT NULL COMMENT '급여 계산 종료일 (당월 25일)',
    payment_date DATE NOT NULL COMMENT '실제 지급일 (월말)',
    work_days DECIMAL(5,2) DEFAULT 22 COMMENT '총 근무일수',
    actual_work_days DECIMAL(5,2) DEFAULT 22 COMMENT '실제 근무일수',
    base_salary DECIMAL(12,2) NOT NULL COMMENT '기본급',
    hourly_rate DECIMAL(8,2) NOT NULL COMMENT '시급',
    overtime_rate DECIMAL(8,2) NOT NULL COMMENT '오버타임 시급',
    position_allowance DECIMAL(10,2) DEFAULT 0 COMMENT '직책 수당',
    meal_allowance DECIMAL(10,2) DEFAULT 0 COMMENT '식대',
    transport_allowance DECIMAL(10,2) DEFAULT 0 COMMENT '교통비',
    performance_bonus DECIMAL(10,2) DEFAULT 0 COMMENT '성과 보너스',
    special_bonus DECIMAL(10,2) DEFAULT 0 COMMENT '특별 보너스',
    bonus_reason VARCHAR(200) COMMENT '보너스 사유',
    total_overtime_hours DECIMAL(6,2) DEFAULT 0 COMMENT '총 오버타임 시간',
    social_insurance DECIMAL(10,2) DEFAULT 0 COMMENT '사회보험료',
    personal_tax DECIMAL(10,2) DEFAULT 0 COMMENT '개인소득세',
    advance_salary DECIMAL(10,2) DEFAULT 0 COMMENT '가불금',
    salary_deduction DECIMAL(10,2) DEFAULT 0 COMMENT '임금 삭감액',
    other_deductions DECIMAL(10,2) DEFAULT 0 COMMENT '기타 공제',
    status ENUM('DRAFT', 'PENDING', 'APPROVED', 'PAID') DEFAULT 'DRAFT',
    created_by INT NOT NULL COMMENT '작성자',
    approved_by INT COMMENT '승인자',
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    UNIQUE KEY unique_employee_month (employee_id, pay_year, pay_month)
);

-- 4️⃣ 오버타임 기록 테이블
CREATE TABLE overtime_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payroll_id INT NOT NULL,
    employee_id INT NOT NULL,
    overtime_date DATE NOT NULL,
    start_time TIME DEFAULT '17:00:00' COMMENT '오버타임 시작 (정규 퇴근 후)',
    end_time TIME NOT NULL COMMENT '오버타임 종료',
    overtime_hours DECIMAL(4,2) GENERATED ALWAYS AS (
        CASE 
            WHEN start_time < end_time THEN 
                ROUND(TIME_TO_SEC(TIMEDIFF(end_time, start_time)) / 3600, 2)
            ELSE 0 
        END
    ) STORED COMMENT '오버타임 시간',
    work_description TEXT NOT NULL COMMENT '오버타임 업무 내용',
    reason ENUM('PROJECT_DEADLINE', 'URGENT_TASK', 'SYSTEM_MAINTENANCE', 'MEETING', 'OTHER') DEFAULT 'OTHER',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_by INT NOT NULL COMMENT '등록한 관리자',
    approved_by INT COMMENT '승인한 관리자',
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT COMMENT '거부 사유',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (payroll_id) REFERENCES payroll_statements(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id)
);

-- ========================================
-- 🎯 샘플 데이터 생성
-- ========================================

-- 👑 기본 관리자 계정 생성
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
 'Bangkok Bank', '501-3-11111-2', 23000.00, 5.00, 3.00, 3.8);

-- 📊 2025년 7월 급여명세서 생성
INSERT INTO payroll_statements (
    employee_id, pay_year, pay_month, pay_period_start, pay_period_end, payment_date,
    work_days, actual_work_days, base_salary, hourly_rate, overtime_rate,
    position_allowance, meal_allowance, transport_allowance,
    performance_bonus, special_bonus, bonus_reason,
    social_insurance, personal_tax, created_by
) 
SELECT 
    e.id,
    2025, 'JULY', '2025-06-26', '2025-07-25', '2025-07-31',
    22, 22, 
    e.monthly_salary,
    e.hourly_rate,
    e.overtime_rate,
    CASE 
        WHEN e.nick_name = 'ICE' THEN 2000.00
        WHEN e.nick_name = 'MARY' THEN 3000.00
        WHEN e.nick_name = 'JOHN' THEN 1500.00
        ELSE 1000.00
    END,
    1500.00, -- 식대
    1000.00, -- 교통비
    CASE 
        WHEN e.performance_rating >= 4.5 THEN 2000.00
        WHEN e.performance_rating >= 4.0 THEN 1500.00
        WHEN e.performance_rating >= 3.5 THEN 1000.00
        ELSE 0
    END,
    CASE 
        WHEN e.nick_name = 'ICE' THEN 2000.00
        WHEN e.nick_name = 'MARY' THEN 3000.00
        ELSE 0
    END,
    CASE 
        WHEN e.nick_name = 'ICE' THEN '프로젝트 완료 특별 보너스'
        WHEN e.nick_name = 'MARY' THEN '우수사원 특별 보너스'
        ELSE NULL
    END,
    ROUND(e.monthly_salary * e.social_insurance_rate / 100, 2),
    ROUND(e.monthly_salary * e.tax_rate / 100, 2),
    1
FROM employees e 
WHERE e.status = 'ACTIVE';

-- ⏰ 샘플 오버타임 데이터
INSERT INTO overtime_records (payroll_id, employee_id, overtime_date, start_time, end_time, work_description, reason, priority, created_by) VALUES
(1, 1, '2025-07-15', '17:00:00', '19:30:00', '프로젝트 마감 작업', 'PROJECT_DEADLINE', 'HIGH', 1),
(1, 1, '2025-07-20', '17:00:00', '18:00:00', '시스템 점검', 'SYSTEM_MAINTENANCE', 'MEDIUM', 1),
(2, 2, '2025-07-10', '17:00:00', '18:30:00', '인사 업무 처리', 'URGENT_TASK', 'MEDIUM', 1);

-- ========================================
-- 🔧 저장 프로시저 생성
-- ========================================

DELIMITER //

-- 1️⃣ 관리자 로그인
CREATE PROCEDURE AdminLogin(
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(255)
)
BEGIN
    IF EXISTS (
        SELECT 1 FROM admin_users 
        WHERE username = p_username 
          AND password_hash = p_password 
          AND is_active = TRUE
    ) THEN
        UPDATE admin_users 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE username = p_username;
        
        SELECT 
            id, username, full_name, email, role, department, 
            'SUCCESS' as status, '로그인 성공' as message
        FROM admin_users 
        WHERE username = p_username;
    ELSE
        SELECT 'FAILED' as status, '로그인 실패' as message;
    END IF;
END //

-- 2️⃣ 오버타임 등록
CREATE PROCEDURE AddOvertimeRecord(
    IN p_employee_id INT,
    IN p_overtime_date DATE,
    IN p_start_time TIME,
    IN p_end_time TIME,
    IN p_work_description TEXT,
    IN p_reason ENUM('PROJECT_DEADLINE', 'URGENT_TASK', 'SYSTEM_MAINTENANCE', 'MEETING', 'OTHER'),
    IN p_priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
    IN p_admin_id INT
)
BEGIN
    DECLARE v_payroll_id INT;
    DECLARE v_pay_year INT;
    DECLARE v_pay_month VARCHAR(20);
    
    -- 급여 기간 찾기
    IF DAY(p_overtime_date) >= 26 THEN
        SET v_pay_year = YEAR(p_overtime_date);
        SET v_pay_month = UPPER(MONTHNAME(DATE_ADD(p_overtime_date, INTERVAL 1 MONTH)));
    ELSE
        SET v_pay_year = YEAR(p_overtime_date);
        SET v_pay_month = UPPER(MONTHNAME(p_overtime_date));
    END IF;
    
    -- 급여명세서 찾기
    SELECT id INTO v_payroll_id
    FROM payroll_statements 
    WHERE employee_id = p_employee_id 
      AND pay_year = v_pay_year 
      AND pay_month = v_pay_month;
    
    IF v_payroll_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '해당 기간의 급여명세서가 없습니다.';
    END IF;
    
    -- 오버타임 기록 추가
    INSERT INTO overtime_records (
        payroll_id, employee_id, overtime_date, start_time, end_time,
        work_description, reason, priority, created_by
    ) VALUES (
        v_payroll_id, p_employee_id, p_overtime_date, p_start_time, p_end_time,
        p_work_description, p_reason, p_priority, p_admin_id
    );
    
    -- 급여명세서 오버타임 시간 업데이트
    UPDATE payroll_statements 
    SET total_overtime_hours = (
        SELECT COALESCE(SUM(overtime_hours), 0)
        FROM overtime_records 
        WHERE payroll_id = v_payroll_id 
          AND status = 'APPROVED'
    )
    WHERE id = v_payroll_id;
    
    SELECT LAST_INSERT_ID() as overtime_id, '오버타임이 등록되었습니다.' as message;
END //

-- 3️⃣ 오버타임 승인/거부
CREATE PROCEDURE ApproveOvertimeRecord(
    IN p_overtime_id INT,
    IN p_admin_id INT,
    IN p_action ENUM('APPROVE', 'REJECT'),
    IN p_rejection_reason TEXT
)
BEGIN
    DECLARE v_payroll_id INT;
    
    SELECT payroll_id INTO v_payroll_id
    FROM overtime_records 
    WHERE id = p_overtime_id;
    
    IF p_action = 'APPROVE' THEN
        UPDATE overtime_records 
        SET status = 'APPROVED',
            approved_by = p_admin_id,
            approved_at = CURRENT_TIMESTAMP
        WHERE id = p_overtime_id;
    ELSE
        UPDATE overtime_records 
        SET status = 'REJECTED',
            approved_by = p_admin_id,
            approved_at = CURRENT_TIMESTAMP,
            rejection_reason = p_rejection_reason
        WHERE id = p_overtime_id;
    END IF;
    
    -- 급여명세서 오버타임 시간 재계산
    UPDATE payroll_statements 
    SET total_overtime_hours = (
        SELECT COALESCE(SUM(overtime_hours), 0)
        FROM overtime_records 
        WHERE payroll_id = v_payroll_id 
          AND status = 'APPROVED'
    )
    WHERE id = v_payroll_id;
    
    SELECT CONCAT('오버타임이 ', p_action, ' 처리되었습니다.') as message;
END //

-- 4️⃣ 보너스 추가/수정
CREATE PROCEDURE UpdateEmployeeBonus(
    IN p_payroll_id INT,
    IN p_performance_bonus DECIMAL(10,2),
    IN p_special_bonus DECIMAL(10,2),
    IN p_bonus_reason VARCHAR(200),
    IN p_admin_id INT
)
BEGIN
    UPDATE payroll_statements 
    SET 
        performance_bonus = p_performance_bonus,
        special_bonus = p_special_bonus,
        bonus_reason = p_bonus_reason
    WHERE id = p_payroll_id;
    
    SELECT '보너스가 업데이트되었습니다.' as message;
END //

-- 5️⃣ 월간 급여 현황 조회
CREATE PROCEDURE GetMonthlyPayrollSummary(
    IN p_year INT,
    IN p_month VARCHAR(20),
    IN p_department VARCHAR(100)
)
BEGIN
    SELECT 
        e.employee_code,
        e.department,
        e.nick_name,
        e.full_name,
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
    WHERE ps.pay_year = p_year 
      AND ps.pay_month = p_month
      AND (p_department IS NULL OR e.department = p_department)
    ORDER BY e.department, e.nick_name;
END //

-- 6️⃣ 오버타임 현황 조회
CREATE PROCEDURE GetOvertimeRecords(
    IN p_year INT,
    IN p_month VARCHAR(20),
    IN p_status ENUM('ALL', 'PENDING', 'APPROVED', 'REJECTED')
)
BEGIN
    SELECT 
        ot.id,
        e.employee_code,
        e.nick_name,
        e.full_name,
        ot.overtime_date,
        ot.start_time,
        ot.end_time,
        ot.overtime_hours,
        ot.work_description,
        ot.reason,
        ot.priority,
        ot.status,
        admin_created.full_name as created_by_name,
        admin_approved.full_name as approved_by_name,
        ot.approved_at,
        ot.rejection_reason,
        ot.created_at
    FROM overtime_records ot
    JOIN employees e ON ot.employee_id = e.id
    JOIN payroll_statements ps ON ot.payroll_id = ps.id
    LEFT JOIN admin_users admin_created ON ot.created_by = admin_created.id
    LEFT JOIN admin_users admin_approved ON ot.approved_by = admin_approved.id
    WHERE ps.pay_year = p_year 
      AND ps.pay_month = p_month
      AND (p_status = 'ALL' OR ot.status = p_status)
    ORDER BY ot.overtime_date DESC, e.nick_name;
END //

DELIMITER ;

-- ========================================
-- 🎯 확인용 쿼리
-- ========================================

-- 📊 전체 급여 현황 조회
SELECT 
    e.employee_code,
    e.department,
    e.nick_name,
    e.full_name,
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
ORDER BY e.department, e.nick_name; 