# 🚀 급여 관리 시스템 설정 가이드

## 📋 **필요한 단계**

### 1단계: Supabase 프로젝트 정보 확인

1. **Supabase 대시보드 접속**
   - https://supabase.com 에서 로그인
   - 프로젝트 선택 또는 새 프로젝트 생성

2. **Project URL 확인**
   - Settings → API → Project URL 복사
   - 예: `https://abcdefghijklmnop.supabase.co`

3. **API Key 확인**
   - Settings → API → anon public 키 복사
   - 예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2단계: 환경 변수 설정

1. **프로젝트 루트에서 `.env.local` 파일 편집**
   ```bash
   nano .env.local
   ```

2. **실제 값으로 교체**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

3. **파일 저장 후 개발 서버 재시작**
   ```bash
   npm run dev
   ```

### 3단계: 데이터베이스 스키마 적용

1. **Supabase SQL Editor 접속**
   - Supabase 대시보드 → SQL Editor

2. **스키마 파일 실행**
   - `payroll_system_supabase.sql` 파일 내용 복사
   - SQL Editor에 붙여넣기 후 실행

3. **샘플 데이터 추가**
   - `sample_data_safe.sql` 파일 내용 복사
   - SQL Editor에 붙여넣기 후 실행

### 4단계: 애플리케이션 테스트

1. **환경 변수 설정 후 원래 컴포넌트로 복원**
   ```tsx
   // app/page.tsx
   import EnhancedPayrollDashboard from '@/components/EnhancedPayrollDashboard'
   
   export default function Home() {
     return <EnhancedPayrollDashboard />
   }
   ```

2. **브라우저에서 확인**
   - http://localhost:3000 접속
   - 데이터가 정상적으로 로드되는지 확인

## 🔧 **문제 해결**

### 환경 변수 오류
```
TypeError: Invalid URL
```
**해결방법**: `.env.local` 파일에 실제 Supabase URL과 API 키 설정

### 데이터 로드 실패
```
Error: Supabase 클라이언트가 초기화되지 않았습니다
```
**해결방법**: 
1. 환경 변수 확인
2. Supabase 프로젝트 활성화 확인
3. RLS 정책 설정 확인

### 빌드 오류
```
Module not found: Can't resolve '@/components/...'
```
**해결방법**: 
1. `npm install` 실행
2. TypeScript 경로 설정 확인

## 📊 **예상 결과**

환경 변수를 올바르게 설정하면:

- ✅ **실시간 데이터 로드**
- ✅ **직원 추가/수정/삭제**
- ✅ **오버타임 추가/승인/거부**
- ✅ **급여 현황 실시간 업데이트**
- ✅ **검색 및 필터링 기능**

## 🎯 **다음 단계**

1. **Supabase 프로젝트 생성** (아직 안 했다면)
2. **환경 변수 설정**
3. **데이터베이스 스키마 적용**
4. **샘플 데이터 추가**
5. **애플리케이션 테스트**

환경 변수 설정이 완료되면 알려주세요! 🚀 