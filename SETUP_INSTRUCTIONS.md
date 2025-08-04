# Saboo ERP 설정 가이드

## 🚀 프로젝트 개요

Saboo ERP는 Supabase와 Next.js로 구축된 통합 기업 자원 관리 시스템입니다.

## 📋 필수 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# 프로젝트 정보
NEXT_PUBLIC_PROJECT_NAME=saboo-erp
```

### 2. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 이름: `saboo-erp`
3. 데이터베이스 비밀번호 설정
4. 프로젝트 생성 완료 후 Settings > API에서 URL과 Key 복사

### 3. 데이터베이스 초기화

Supabase SQL Editor에서 다음 파일들을 순서대로 실행:

1. `payroll_system_supabase.sql` - 기본 테이블 구조
2. `sample_data.sql` - 샘플 데이터
3. `storage_permissions_fix.sql` - 파일 업로드 권한

### 4. Storage 버킷 설정

Supabase Storage에서 다음 버킷들을 생성:

- `company-logos` - 회사 로고 저장
- `dashboard-logos` - 대시보드 로고 저장
- `employee-photos` - 직원 사진 저장

각 버킷의 RLS 정책을 설정하여 적절한 접근 권한을 부여하세요.

## 🛠️ 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 📱 주요 기능

- **급여 관리**: 직원별 맞춤 급여 및 자동 계산
- **인사 관리**: 직원 정보 및 부서 관리
- **오버타임 관리**: 승인 워크플로우 포함
- **포인트 시스템**: 성과 기반 포인트 관리
- **실시간 대시보드**: 현대적인 UI/UX

## 🔐 기본 관리자 계정

- Username: `admin`
- Password: `admin123`

## 🚨 문제 해결

### Supabase 연결 오류
- 환경 변수 확인
- Supabase 프로젝트 상태 확인
- 네트워크 연결 상태 확인

### 데이터 오류
- Supabase 대시보드에서 테이블 구조 확인
- SQL Editor에서 데이터 확인
- RLS 정책 확인

## 📞 지원

문제가 발생하면 프로젝트 이슈를 생성하거나 개발팀에 문의하세요. 