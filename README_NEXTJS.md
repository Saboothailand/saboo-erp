# 🌟 급여 관리 시스템 - Next.js 애플리케이션

> **Supabase PostgreSQL + Next.js 연동**  
> **완전한 웹 애플리케이션**

---

## 🚀 설치 및 실행

### 1단계: 의존성 설치
```bash
npm install
```

### 2단계: Supabase 프로젝트 설정
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 설정에서 URL과 API 키 확인
3. SQL Editor에서 `payroll_system_supabase.sql` 파일 실행

### 3단계: 환경 변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**⚠️ 중요**: 실제 Supabase 프로젝트의 URL과 API 키로 교체하세요.

### 4단계: 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

---

## 🔧 문제 해결

### 환경 변수 오류
```
Error: Supabase 클라이언트가 초기화되지 않았습니다.
```
**해결방법**: `.env.local` 파일이 올바르게 설정되었는지 확인

### 데이터베이스 연결 오류
```
Error: 직원 데이터를 불러올 수 없습니다
```
**해결방법**: 
1. Supabase 프로젝트에서 SQL 스키마가 실행되었는지 확인
2. RLS(Row Level Security) 설정 확인
3. API 키 권한 확인

### 빌드 오류
```bash
npm run build
```
**해결방법**: TypeScript 오류 수정 후 다시 빌드

---

## 📁 프로젝트 구조

```
payroll-management/
├── app/
│   ├── globals.css          # 전역 스타일
│   ├── layout.tsx           # 레이아웃
│   └── page.tsx             # 메인 페이지
├── components/
│   └── PayrollDashboard.tsx # 메인 대시보드 컴포넌트
├── lib/
│   └── supabase.ts          # Supabase 클라이언트 설정
├── payroll_system_supabase.sql  # 데이터베이스 스키마
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

---

## 🎯 주요 기능

### 📊 대시보드
- 총 직원수, 급여지급액, 오버타임 시간, 승인 대기 현황
- 부서별 급여 현황 차트
- 최근 오버타임 현황

### 💰 급여 관리
- 직원별 급여명세서 조회
- 검색 및 필터링 기능
- 월별/연도별 조회
- 급여 상세 내역 표시

### ⏰ 오버타임 관리
- 오버타임 등록/승인/거부
- 실시간 상태 업데이트
- 우선순위별 관리

### 👥 직원 관리
- 직원 목록 조회
- 부서별 분류
- 성과평가 현황

---

## 🔧 Supabase 연동

### 데이터베이스 설정
1. Supabase 프로젝트 생성
2. SQL Editor에서 `payroll_system_supabase.sql` 실행
3. 환경 변수에 프로젝트 URL과 API 키 설정

### 주요 함수들
- `loadData()`: 직원, 급여, 오버타임 데이터 로드
- `handleOvertimeAction()`: 오버타임 승인/거부
- `handleAddOvertime()`: 새 오버타임 등록

---

## 🎨 UI/UX 특징

### 반응형 디자인
- 모바일, 태블릿, 데스크톱 지원
- 사이드바 접기/펼치기 기능

### 실시간 데이터
- Supabase 실시간 구독
- 자동 데이터 새로고침

### 에러 처리
- 네트워크 오류 시 사용자 친화적 메시지
- 데이터 로드 실패 시 재시도 옵션 