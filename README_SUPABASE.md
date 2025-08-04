# 🌟 태국 회사 월급명세서 관리 시스템 (Supabase PostgreSQL 버전)

> **Supabase PostgreSQL + Next.js 연동**  
> **완벽한 급여 관리 솔루션**

---

## 🚀 시스템 개요

이 시스템은 태국 회사를 위한 완전한 월급명세서 관리 솔루션입니다. Supabase에서 호스팅되는 PostgreSQL 데이터베이스와 Next.js를 연동하여 사용합니다.

### ✨ 주요 특징
- ✅ **직원별 맞춤 급여**: 각자 다른 월급과 수당
- ✅ **자동 오버타임 계산**: 시작/종료 시간 입력으로 자동 계산
- ✅ **게시판 형식 관리**: 관리자가 비밀번호로 접근하여 오버타임 기입
- ✅ **26일 기준 급여 기간**: 매월 26일~25일 기준
- ✅ **월말 지급**: 31일 또는 30일에 실수령
- ✅ **다양한 보너스**: 성과 보너스, 특별 보너스
- ✅ **실시간 계산**: 자동으로 총수당, 총공제, 실수령액 계산
- ✅ **PostgreSQL 최적화**: Generated Columns, 트리거, 함수 활용

---

## 🛠️ 설치 및 설정

### 1단계: Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 설정에서 Database 정보 확인
3. SQL Editor 접근

### 2단계: 데이터베이스 설정
1. Supabase Dashboard → SQL Editor
2. `payroll_system_supabase.sql` 파일 내용을 복사해서 실행
3. 모든 테이블, 함수, 트리거가 자동 생성됩니다

### 3단계: Next.js 연동
```bash
# Next.js 프로젝트 생성
npx create-next-app@latest payroll-app --typescript --tailwind --eslint

# Supabase 클라이언트 설치
npm install @supabase/supabase-js
```

### 4단계: 환경 변수 설정
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📊 데이터베이스 구조

### 🏢 테이블 구성
1. **admin_users**: 관리자 인증
2. **employees**: 직원 마스터 정보
3. **payroll_statements**: 월급명세서
4. **overtime_records**: 오버타임 기록

### 👥 샘플 직원 데이터
| 직원코드 | 부서 | 닉네임 | 월급 | 성과평가 |
|----------|------|--------|------|----------|
| EMP001 | IT | ICE | 25,000 | 4.5 |
| EMP002 | HR | JOHN | 22,000 | 4.0 |
| EMP003 | Finance | MARY | 28,000 | 4.8 |
| EMP004 | IT | TOM | 23,000 | 3.8 |
| EMP005 | Marketing | LISA | 24,000 | 4.2 |

---

## 💰 급여 구성 요소

### 기본 급여
- **기본급**: 월 기본급 (직원별 상이)
- **시급**: 기본급 ÷ 22일 ÷ 8시간 (월 평균 근무시간)
- **오버타임 시급**: 시급 × 1.5배

### 수당
- **직책 수당**: 직책별 차등 지급
- **식대**: 월 1,500원
- **교통비**: 월 1,000원
- **성과 보너스**: 성과 평가 기반
- **특별 보너스**: 특별 사유로 지급

### 공제
- **사회보험료**: 기본급의 5%
- **개인소득세**: 기본급의 3%
- **가불금**: 선지급된 금액
- **기타 공제**: 기타 공제 사항

---

## 🎯 주요 기능 사용법

### 🔐 관리자 로그인
```sql
-- 기본 관리자 계정으로 로그인
SELECT * FROM admin_login('admin', 'admin123');
```

### ⏰ 오버타임 관리

#### 오버타임 등록 (게시판 형식)
```sql
-- 직원ID, 날짜, 시작시간, 종료시간, 작업설명, 등록자ID, 사유, 우선순위
SELECT add_overtime_record(1, '2025-07-15', '17:00:00', '19:30:00', 
    '프로젝트 마감 작업', 1, 'PROJECT_DEADLINE', 'HIGH');
```

#### 오버타임 승인/거부
```sql
-- 승인
SELECT approve_overtime_record(1, 1, 'APPROVE', NULL);

-- 거부 (사유 포함)
SELECT approve_overtime_record(1, 1, 'REJECT', '업무량 부족');
```

#### 오버타임 현황 조회
```sql
-- 전체 오버타임 조회
SELECT * FROM get_overtime_records(2025, 'JULY', 'ALL');

-- 승인된 오버타임만 조회
SELECT * FROM get_overtime_records(2025, 'JULY', 'APPROVED');

-- 대기중인 오버타임만 조회
SELECT * FROM get_overtime_records(2025, 'JULY', 'PENDING');
```

### 💰 급여 관리

#### 보너스 추가/수정
```sql
-- 성과 보너스와 특별 보너스 추가
SELECT update_employee_bonus(1, 1500.00, 2000.00, 
    '프로젝트 완료 특별 보너스', 1);
```

#### 급여 현황 조회
```sql
-- 전체 부서 급여 현황
SELECT * FROM get_monthly_payroll_summary(2025, 'JULY', NULL);

-- 특정 부서만 조회
SELECT * FROM get_monthly_payroll_summary(2025, 'JULY', 'IT');
```

### 📊 급여 상세 조회
```sql
-- 특정 직원의 급여 상세 내역
SELECT 
    e.employee_code,
    e.nick_name,
    e.full_name,
    ps.pay_year,
    ps.pay_month,
    ps.base_salary,
    (ps.position_allowance + ps.meal_allowance + ps.transport_allowance) as total_allowances,
    (ps.performance_bonus + ps.special_bonus) as total_bonus,
    (ps.base_salary + (ps.total_overtime_hours * ps.overtime_rate) + ps.performance_bonus + ps.special_bonus + ps.position_allowance + ps.meal_allowance + ps.transport_allowance) as gross_salary,
    (ps.social_insurance + ps.personal_tax + ps.advance_salary + ps.salary_deduction + ps.other_deductions) as total_deductions,
    (ps.base_salary + (ps.total_overtime_hours * ps.overtime_rate) + ps.performance_bonus + ps.special_bonus + ps.position_allowance + ps.meal_allowance + ps.transport_allowance - ps.social_insurance - ps.personal_tax - ps.advance_salary - ps.salary_deduction - ps.other_deductions) as net_salary
FROM payroll_statements ps
JOIN employees e ON ps.employee_id = e.id
WHERE e.nick_name = 'ICE' 
    AND ps.pay_year = 2025 
    AND ps.pay_month = 'JULY';
```

---

## 📅 월간 업무 프로세스

### 1️⃣ 월초 (26일)
- 새 급여명세서 생성
- 기본 급여 정보 입력

### 2️⃣ 월중
- 오버타임 등록 및 승인
- 보너스 추가
- 급여 정보 업데이트

### 3️⃣ 월말 (25일)
- 급여 확정
- 최종 계산 완료

### 4️⃣ 지급일 (30일/31일)
- 급여 지급 완료

---

## 🔧 시스템 관리

### 새 직원 추가
```sql
INSERT INTO employees (
    employee_code, nick_name, full_name, full_name_thai, 
    department, start_date, bank_name, bank_account, 
    monthly_salary, social_insurance_rate, tax_rate, 
    performance_rating
) VALUES (
    'EMP006', 'NEW', 'New Employee', 'นาย นิว เอมพลอย',
    'IT', '2025-01-01', 'Bangkok Bank', '123-4-56789-0',
    26000.00, 5.00, 3.00, 4.0
);
```

### 새 급여명세서 생성
```sql
-- 8월 급여명세서 생성 예시
WITH payroll_data AS (
    SELECT 
        e.id as employee_id,
        2025 as pay_year,
        'AUGUST' as pay_month,
        '2025-07-26'::date as pay_period_start,
        '2025-08-25'::date as pay_period_end,
        '2025-08-31'::date as payment_date,
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
    social_insurance, personal_tax, created_by
)
SELECT * FROM payroll_data;
```

---

## 📈 리포트 생성

### 부서별 급여 현황
```sql
SELECT 
    e.department,
    COUNT(*) as employee_count,
    SUM(ps.base_salary + (ps.total_overtime_hours * ps.overtime_rate) + ps.performance_bonus + ps.special_bonus + ps.position_allowance + ps.meal_allowance + ps.transport_allowance - ps.social_insurance - ps.personal_tax - ps.advance_salary - ps.salary_deduction - ps.other_deductions) as total_salary,
    AVG(ps.base_salary + (ps.total_overtime_hours * ps.overtime_rate) + ps.performance_bonus + ps.special_bonus + ps.position_allowance + ps.meal_allowance + ps.transport_allowance - ps.social_insurance - ps.personal_tax - ps.advance_salary - ps.salary_deduction - ps.other_deductions) as avg_salary,
    SUM(ps.position_allowance + ps.meal_allowance + ps.transport_allowance) as total_allowances,
    SUM(ps.performance_bonus + ps.special_bonus) as total_bonus
FROM payroll_statements ps
JOIN employees e ON ps.employee_id = e.id
WHERE ps.pay_year = 2025 AND ps.pay_month = 'JULY'
GROUP BY e.department;
```

### 오버타임 통계
```sql
SELECT 
    e.department,
    e.nick_name,
    COUNT(ot.id) as overtime_count,
    SUM(ot.overtime_hours) as total_overtime_hours,
    SUM(ot.overtime_hours * ps.overtime_rate) as total_overtime_pay
FROM overtime_records ot
JOIN employees e ON ot.employee_id = e.id
JOIN payroll_statements ps ON ot.payroll_id = ps.id
WHERE ps.pay_year = 2025 
    AND ps.pay_month = 'JULY' 
    AND ot.status = 'APPROVED'
GROUP BY e.department, e.nick_name
ORDER BY total_overtime_hours DESC;
```

---

## 🚨 문제 해결

### 연결 오류
- **Supabase URL**: 프로젝트 설정에서 확인
- **API Key**: Settings → API에서 확인
- **RLS 정책**: Row Level Security 설정 확인

### 데이터 오류
```sql
-- 테이블 구조 확인
\d employees;
\d payroll_statements;

-- 데이터 확인
SELECT * FROM employees;
SELECT * FROM payroll_statements;

-- 함수 확인
\df admin_login;
\df add_overtime_record;
```

### 계산 오류
- Generated Columns가 제대로 계산되지 않는 경우 테이블 재생성
- `payroll_system_supabase.sql` 파일을 다시 실행

---

## 🎉 완성!

이제 완벽한 월급명세서 관리 시스템을 사용하실 수 있습니다! 

**주요 성과:**
- ✅ Supabase PostgreSQL + Next.js 완벽 연동
- ✅ 직원별 맞춤 급여 시스템
- ✅ 자동 오버타임 계산
- ✅ 게시판 형식 오버타임 관리
- ✅ 실시간 급여 현황 조회
- ✅ PostgreSQL 최적화 (Generated Columns, 트리거, 함수)
- ✅ 완전한 급여 관리 솔루션

행복한 급여 관리 되세요! 💰✨ 