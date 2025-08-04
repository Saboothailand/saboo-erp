# 🚀 Saboo ERP Netlify 배포 가이드

## 📋 Netlify 배포 절차

### 1단계: Netlify 프로젝트 생성

1. **[Netlify.com](https://netlify.com)**에 로그인
2. **Add new site** → **Import an existing project**
3. **Deploy with GitHub** 클릭
4. `Saboothailand/saboo-erp` 저장소 선택

### 2단계: 빌드 설정

**Build settings:**
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `18`

### 3단계: 환경변수 설정

Netlify 대시보드의 **Site settings** → **Environment variables**에서 설정:

```env
NEXT_PUBLIC_SUPABASE_URL=https://utesnkxljuxcgitlcizr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZXNua3hsanV4Y2dpdGxjaXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODA0NzYsImV4cCI6MjA2OTU1NjQ3Nn0.5ih16HB_y8Yo1i1O4cxo1x0I_-Q3VsRB5m5EB6uXd3g
NEXT_PUBLIC_PROJECT_NAME=saboo-erp
```

### 4단계: 배포 실행

1. **Deploy site** 클릭
2. 배포 진행 상황 모니터링
3. 배포 완료 후 도메인 확인

## 🌐 배포 후 접속

### 자동 생성 도메인
```
https://saboo-erp-xxxx.netlify.app
```

### 커스텀 도메인 설정 (선택사항)
1. Netlify 대시보드 → **Domain settings**
2. **Custom domains**에서 도메인 추가
3. DNS 설정 업데이트

## 🔄 자동 배포 (CI/CD)

### GitHub 연동
- GitHub에 Push하면 자동으로 재배포
- 브랜치별 배포 설정 가능

### 배포 브랜치 설정
- **Production**: `main` 브랜치
- **Preview**: `develop` 브랜치 (선택사항)

## 📊 모니터링

### 로그 확인
- Netlify 대시보드 → **Functions** 탭
- 실시간 로그 스트리밍
- 에러 로그 확인

### 성능 모니터링
- 응답 시간
- 빌드 시간
- 배포 상태

## 🛠️ 문제 해결

### 일반적인 문제들

#### 1. 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build
```

#### 2. 환경변수 오류
- Netlify Environment variables 확인
- `NEXT_PUBLIC_` 접두사 확인

#### 3. 포트 오류
- Netlify는 자동으로 포트 설정
- `netlify.toml` 설정 확인

## 🔒 보안 설정

### 환경변수 보안
- 민감한 정보는 Netlify Environment variables에만 저장
- `.env` 파일을 Git에 커밋하지 않음

### HTTPS 설정
- Netlify는 자동으로 HTTPS 제공
- 커스텀 도메인도 HTTPS 자동 설정

## 📈 스케일링

### 자동 스케일링
- 트래픽에 따라 자동으로 스케일링
- 무료 플랜: 월 100GB 대역폭

### 수동 스케일링
- Netlify 대시보드에서 설정 조정
- 함수 실행 시간 조정

## 🎉 배포 완료!

배포가 완료되면 다음 URL로 접속 가능:
```
https://saboo-erp-xxxx.netlify.app
```

### 테스트 체크리스트
- [ ] 홈페이지 로딩 확인
- [ ] 로그인 기능 테스트
- [ ] 대시보드 접속 확인
- [ ] 권한 시스템 테스트
- [ ] 로고 업로드 기능 테스트

## 📞 지원

문제가 발생하면:
1. Netlify 로그 확인
2. GitHub Issues 생성
3. 개발팀 문의

---

**Happy Deploying! 🚀** 