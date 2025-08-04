# 🔧 Supabase 대시보드에서 RLS 비활성화 방법

## 🚫 방법 1: Authentication > Policies에서 직접 설정

### 1단계: Supabase 대시보드 접속
1. https://supabase.com 에서 로그인
2. 프로젝트 `utesnkxljuxcgitlcizr` 선택

### 2단계: Authentication > Policies로 이동
1. 왼쪽 메뉴에서 **"Authentication"** 클릭
2. **"Policies"** 탭 클릭

### 3단계: employees 테이블 정책 설정
1. **"employees"** 테이블 찾기
2. **"New Policy"** 버튼 클릭
3. **"Create a policy from scratch"** 선택
4. 다음 설정으로 입력:
   - **Policy Name**: `Enable all operations`
   - **Target roles**: `authenticated`, `anon` 모두 체크
   - **Using expression**: `true`
   - **With check expression**: `true`
5. **"Review"** → **"Save policy"** 클릭

### 4단계: 다른 테이블들도 동일하게 설정
- `payroll_statements` 테이블
- `overtime_records` 테이블
- `admin_users` 테이블

## 🚫 방법 2: Database > Settings에서 RLS 비활성화

### 1단계: Database 설정으로 이동
1. 왼쪽 메뉴에서 **"Database"** 클릭
2. **"Settings"** 탭 클릭

### 2단계: RLS 설정 확인
1. **"Row Level Security"** 섹션 찾기
2. RLS가 활성화되어 있다면 비활성화

## 🚫 방법 3: SQL Editor에서 강제 해결

### 1단계: SQL Editor에서 실행
```sql
-- 모든 정책 삭제
DROP POLICY IF EXISTS "Admin users can do everything" ON admin_users;
DROP POLICY IF EXISTS "Employees can be viewed by all" ON employees;
DROP POLICY IF EXISTS "Payroll statements can be viewed by all" ON payroll_statements;
DROP POLICY IF EXISTS "Overtime records can be viewed by all" ON overtime_records;
DROP POLICY IF EXISTS "Enable all operations for admin_users" ON admin_users;
DROP POLICY IF EXISTS "Enable all operations for employees" ON employees;
DROP POLICY IF EXISTS "Enable all operations for payroll_statements" ON payroll_statements;
DROP POLICY IF EXISTS "Enable all operations for overtime_records" ON overtime_records;

-- RLS 완전 비활성화
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_statements DISABLE ROW LEVEL SECURITY;
ALTER TABLE overtime_records DISABLE ROW LEVEL SECURITY;

-- 테이블 권한 확인
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('admin_users', 'employees', 'payroll_statements', 'overtime_records')
ORDER BY tablename;
```

## 🚫 방법 4: 새 프로젝트 생성 (최후의 수단)

만약 위 방법들이 모두 실패한다면:

1. **새 Supabase 프로젝트 생성**
2. **환경 변수 업데이트**
3. **스키마 다시 실행**

## 🎯 확인 방법

### SQL로 RLS 상태 확인
```sql
-- RLS 상태 확인
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('admin_users', 'employees', 'payroll_statements', 'overtime_records')
ORDER BY tablename;

-- 정책 확인
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE tablename IN ('admin_users', 'employees', 'payroll_statements', 'overtime_records')
ORDER BY tablename, policyname;
```

### 예상 결과
- `rowsecurity` 컬럼이 `false`로 표시되어야 함
- `policyname` 결과가 없어야 함 (정책이 모두 삭제됨)

## 🚀 테스트
설정 완료 후:
1. **개발 서버 재시작**: `npm run dev`
2. **http://localhost:3000** 접속
3. **새 직원 등록** 시도

이 중 하나의 방법으로 해결될 것입니다! 