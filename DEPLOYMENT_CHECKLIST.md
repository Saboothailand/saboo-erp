# 🚀 배포 전 체크리스트

## 📋 1단계: Supabase 설정 확인

### ✅ Storage 버킷
- [ ] `company-logos` 버킷 생성
- [ ] `dashboard-logos` 버킷 생성  
- [ ] `employee-photos` 버킷 생성
- [ ] 모든 버킷이 Public으로 설정됨
- [ ] 파일 크기 제한: 5MB
- [ ] 이미지 MIME 타입 허용

### ✅ Storage 정책
- [ ] Public Access 정책 설정
- [ ] Public Upload 정책 설정
- [ ] Public Update 정책 설정
- [ ] Public Delete 정책 설정

### ✅ 데이터베이스 테이블
- [ ] `employees` 테이블 생성
- [ ] `payroll_statements` 테이블 생성
- [ ] `overtime_records` 테이블 생성
- [ ] `point_records` 테이블 생성
- [ ] `admin_users` 테이블 생성
- [ ] 샘플 데이터 삽입 완료

## 📋 2단계: Vercel 환경 변수 설정

### ✅ 환경 변수
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
- [ ] Production 환경에 적용
- [ ] Preview 환경에 적용
- [ ] Development 환경에 적용

### ✅ 배포 설정
- [ ] Framework Preset: Next.js
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`

## 📋 3단계: 로컬 테스트

### ✅ 개발 서버
- [ ] `npm run dev` 실행 성공
- [ ] `http://localhost:3000` 접속 가능
- [ ] 환경 변수 로드 확인
- [ ] Supabase 연결 확인

### ✅ 기능 테스트
- [ ] 로그인 기능 정상 작동
- [ ] 로고 업로드 기능 정상 작동
- [ ] 데이터베이스 CRUD 정상 작동
- [ ] 에러 없음 (브라우저 콘솔)

## 📋 4단계: 배포 실행

### ✅ 코드 커밋
- [ ] 모든 변경사항 커밋
- [ ] GitHub에 푸시 완료
- [ ] Vercel 자동 배포 트리거

### ✅ 배포 모니터링
- [ ] 빌드 로그 확인
- [ ] 환경 변수 로드 확인
- [ ] Supabase 연결 확인
- [ ] 배포 완료 확인

## 📋 5단계: 배포 후 확인

### ✅ 사이트 접속
- [ ] `https://erp.saboothailand.com` 접속 가능
- [ ] SSL 인증서 정상 작동
- [ ] 페이지 로딩 속도 정상

### ✅ 기능 테스트
- [ ] 로그인 기능 테스트
- [ ] 로고 업로드 기능 테스트
- [ ] 데이터베이스 연결 테스트
- [ ] 모든 기능 정상 작동

### ✅ 에러 확인
- [ ] 브라우저 콘솔 에러 없음
- [ ] 네트워크 에러 없음
- [ ] Storage 버킷 에러 없음

## 🚨 문제 발생 시

### 문제 1: Storage 버킷 에러
**해결 방법**:
1. Supabase 대시보드에서 버킷 확인
2. `QUICK_STORAGE_FIX.sql` 재실행
3. 브라우저 캐시 클리어

### 문제 2: 환경 변수 에러
**해결 방법**:
1. Vercel 환경 변수 재설정
2. 재배포 실행
3. 배포 로그 확인

### 문제 3: 데이터베이스 연결 에러
**해결 방법**:
1. Supabase 프로젝트 상태 확인
2. API 키 유효성 확인
3. 네트워크 연결 확인

## ✅ 완료 확인

모든 체크리스트 항목이 완료되면 배포가 성공적으로 완료된 것입니다!

**최종 확인 사항**:
- [ ] 로컬에서 정상 작동
- [ ] 배포 환경에서 정상 작동
- [ ] 모든 기능 테스트 완료
- [ ] 에러 로그 없음 