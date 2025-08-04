-- 🚫 RLS 완전 비활성화 (개발 환경용)

-- ========================================
-- 🧹 모든 정책 삭제
-- ========================================

-- admin_users 테이블 정책 삭제
DROP POLICY IF EXISTS "Admin users can do everything" ON admin_users;
DROP POLICY IF EXISTS "Enable all operations for admin_users" ON admin_users;

-- employees 테이블 정책 삭제
DROP POLICY IF EXISTS "Employees can be viewed by all" ON employees;
DROP POLICY IF EXISTS "Enable all operations for employees" ON employees;

-- payroll_statements 테이블 정책 삭제
DROP POLICY IF EXISTS "Payroll statements can be viewed by all" ON payroll_statements;
DROP POLICY IF EXISTS "Enable all operations for payroll_statements" ON payroll_statements;

-- overtime_records 테이블 정책 삭제
DROP POLICY IF EXISTS "Overtime records can be viewed by all" ON overtime_records;
DROP POLICY IF EXISTS "Enable all operations for overtime_records" ON overtime_records;

-- ========================================
-- 🚫 RLS 완전 비활성화
-- ========================================

ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_statements DISABLE ROW LEVEL SECURITY;
ALTER TABLE overtime_records DISABLE ROW LEVEL SECURITY;

-- ========================================
-- 🎯 확인용 쿼리
-- ========================================

-- RLS 상태 확인
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('admin_users', 'employees', 'payroll_statements', 'overtime_records')
ORDER BY tablename;

-- 정책 확인 (모두 삭제되었는지 확인)
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE tablename IN ('admin_users', 'employees', 'payroll_statements', 'overtime_records')
ORDER BY tablename, policyname;

-- 테이블 권한 확인
SELECT 
    table_name,
    privilege_type,
    grantee
FROM information_schema.table_privileges 
WHERE table_name IN ('admin_users', 'employees', 'payroll_statements', 'overtime_records')
  AND grantee = 'anon'
ORDER BY table_name, privilege_type; 