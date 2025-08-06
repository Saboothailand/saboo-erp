# 🚀 Vercel 배포 완전 가이드

## 📋 1단계: Vercel 환경 변수 설정

### 1.1 Vercel 대시보드 접속
1. **Vercel 대시보드**: https://vercel.com/dashboard
2. **프로젝트 선택**: `saboo-erp` 또는 해당 프로젝트
3. **Settings** 탭 클릭
4. **Environment Variables** 섹션으로 이동

### 1.2 환경 변수 추가
**Add New** 버튼을 클릭하여 다음 변수들을 추가:

#### 변수 1: Supabase URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://utesnkxljuxcgitlcizr.supabase.co`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### 변수 2: Supabase Anon Key
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZXNua3hsanV4Y2dpdGxjaXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODA0NzYsImV4cCI6MjA2OTU1NjQ3Nn0.5ih16HB_y8Yo1i1O4cxo1x0I_-Q3VsRB5m5EB6uXd3g`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### 1.3 설정 확인
- 모든 변수가 **Production, Preview, Development**에 체크되어 있는지 확인
- **Save** 버튼 클릭

## 📋 2단계: 배포 설정

### 2.1 빌드 설정 확인
**Settings** → **General**에서 다음 설정 확인:

- **Framework Preset**: `Next.js`
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

### 2.2 도메인 설정
**Settings** → **Domains**에서:
- **Custom Domain**: `erp.saboothailand.com` 확인
- **SSL Certificate**: 자동 발급 확인

## 📋 3단계: 재배포

### 3.1 수동 재배포
1. **Deployments** 탭 클릭
2. **Redeploy** 버튼 클릭 (최신 배포에서)
3. 배포 진행 상황 모니터링

### 3.2 배포 로그 확인
배포 중 **Build Logs**에서 다음 확인:
- ✅ 환경 변수 로드 성공
- ✅ Supabase 연결 성공
- ✅ 빌드 완료

## 📋 4단계: 배포 후 확인

### 4.1 기능 테스트
1. **메인 페이지** 접속: https://erp.saboothailand.com
2. **로그인** 기능 테스트
3. **로고 업로드** 기능 테스트
4. **데이터베이스 연결** 확인

### 4.2 에러 확인
브라우저 **개발자 도구** → **Console**에서:
- ❌ Storage 버킷 에러 없음
- ❌ 환경 변수 에러 없음
- ❌ 데이터베이스 연결 에러 없음

## 🚨 문제 해결

### 문제 1: 환경 변수 인식 안됨
**해결 방법**:
1. 환경 변수 재설정
2. 재배포 실행
3. 캐시 클리어

### 문제 2: Storage 버킷 에러
**해결 방법**:
1. Supabase에서 버킷 생성 확인
2. SQL 스크립트 재실행
3. 브라우저 캐시 클리어

### 문제 3: 데이터베이스 연결 실패
**해결 방법**:
1. Supabase 프로젝트 상태 확인
2. API 키 유효성 확인
3. 네트워크 연결 확인

## ✅ 배포 체크리스트

- [ ] Vercel 환경 변수 설정 완료
- [ ] Supabase Storage 버킷 생성 완료
- [ ] 데이터베이스 테이블 생성 완료
- [ ] 재배포 실행 완료
- [ ] 기능 테스트 성공
- [ ] 에러 로그 확인 완료

## 📞 지원

문제가 지속되면 다음 정보를 제공해주세요:
- Vercel 배포 로그
- 브라우저 콘솔 에러
- Supabase 대시보드 스크린샷 