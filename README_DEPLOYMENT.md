# 🚀 Saboo ERP Railway 배포 가이드

## 📋 배포 전 준비사항

### 1. GitHub 저장소 준비
- [ ] 프로젝트가 GitHub에 푸시되어 있는지 확인
- [ ] 저장소 이름: `saboo-erp`

### 2. 환경변수 준비
- [ ] Supabase 프로젝트 URL과 API 키
- [ ] 기타 필요한 API 키들

## 🔧 Railway 배포 절차

### 1단계: Railway 프로젝트 생성
1. [Railway.app](https://railway.app)에 로그인
2. **New Project** 클릭
3. **Deploy from GitHub Repo** 선택
4. `saboo-erp` 저장소 선택

### 2단계: 환경변수 설정
Railway 대시보드의 **Variables** 탭에서 다음 환경변수들을 설정:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_PROJECT_NAME=saboo-erp
```

### 3단계: 배포 설정 확인
- **Framework Preset**: Next.js (자동 감지)
- **Build Command**: `npm run build` (자동 설정)
- **Start Command**: `npm start` (자동 설정)

### 4단계: 배포 실행
1. **Deploy Now** 클릭
2. 배포 진행 상황 모니터링
3. 배포 완료 후 도메인 확인

## 🌐 배포 후 접속

### 자동 생성 도메인
```
https://saboo-erp-production-xxxx.up.railway.app
```

### 커스텀 도메인 설정 (선택사항)
1. Railway 대시보드 → **Settings** 탭
2. **Custom Domains** 섹션에서 도메인 추가
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
- Railway 대시보드 → **Deployments** 탭
- 실시간 로그 스트리밍
- 에러 로그 확인

### 성능 모니터링
- 응답 시간
- 메모리 사용량
- CPU 사용량

## 🛠️ 문제 해결

### 일반적인 문제들

#### 1. 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build
```

#### 2. 환경변수 오류
- Railway Variables 탭에서 환경변수 확인
- `NEXT_PUBLIC_` 접두사 확인

#### 3. 포트 오류
- `$PORT` 환경변수가 자동으로 설정됨
- `package.json`의 start 스크립트 확인

### 로그 확인 명령어
```bash
# Railway CLI 사용 (선택사항)
railway logs
```

## 🔒 보안 설정

### 환경변수 보안
- 민감한 정보는 Railway Variables에만 저장
- `.env` 파일을 Git에 커밋하지 않음

### HTTPS 설정
- Railway는 자동으로 HTTPS 제공
- 커스텀 도메인도 HTTPS 자동 설정

## 📈 스케일링

### 자동 스케일링
- 트래픽에 따라 자동으로 스케일링
- 무료 플랜: 월 500시간

### 수동 스케일링
- Railway 대시보드에서 인스턴스 수 조정
- 메모리 할당량 조정

## 🎉 배포 완료!

배포가 완료되면 다음 URL로 접속 가능:
```
https://saboo-erp-production-xxxx.up.railway.app
```

### 테스트 체크리스트
- [ ] 홈페이지 로딩 확인
- [ ] 로그인 기능 테스트
- [ ] 대시보드 접속 확인
- [ ] 권한 시스템 테스트
- [ ] 로고 업로드 기능 테스트

## 📞 지원

문제가 발생하면:
1. Railway 로그 확인
2. GitHub Issues 생성
3. 개발팀 문의

---

**Happy Deploying! 🚀** 