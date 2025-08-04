-- 🔧 RLS 정책 수정 - INSERT, UPDATE, DELETE 권한 추가

-- ========================================
-- 🧹 기존 정책 삭제
-- ========================================

DROP POLICY IF EXISTS "Admin users can do everything" ON admin_users;
DROP POLICY IF EXISTS "Employees can be viewed by all" ON employees;
DROP POLICY IF EXISTS "Payroll statements can be viewed by all" ON payroll_statements;
DROP POLICY IF EXISTS "Overtime records can be viewed by all" ON overtime_records;

-- ========================================
-- ✅ 새로운 RLS 정책 생성
-- ========================================

-- 1️⃣ admin_users 테이블 정책
CREATE POLICY "Enable all operations for admin_users" ON admin_users
    FOR ALL USING (true) WITH CHECK (true);

-- 2️⃣ employees 테이블 정책
CREATE POLICY "Enable all operations for employees" ON employees
    FOR ALL USING (true) WITH CHECK (true);

-- 3️⃣ payroll_statements 테이블 정책
CREATE POLICY "Enable all operations for payroll_statements" ON payroll_statements
    FOR ALL USING (true) WITH CHECK (true);

-- 4️⃣ overtime_records 테이블 정책
CREATE POLICY "Enable all operations for overtime_records" ON overtime_records
    FOR ALL USING (true) WITH CHECK (true);

-- ========================================
-- 🎯 확인용 쿼리
-- ========================================

-- 정책 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('admin_users', 'employees', 'payroll_statements', 'overtime_records')
ORDER BY tablename, policyname;

-- 테이블별 RLS 상태 확인
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('admin_users', 'employees', 'payroll_statements', 'overtime_records')
ORDER BY tablename; 