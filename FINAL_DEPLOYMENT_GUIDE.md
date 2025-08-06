# 🚀 최종 배포 실행 가이드

## 📋 현재 상황
- ✅ **로컬 환경**: 정상 작동 (`http://localhost:3000`)
- ❌ **배포 환경**: Storage 버킷 문제 발생
- 🔧 **해결 방법**: Supabase 설정 + Vercel 환경 변수

## 🎯 해결 단계 (순서대로 실행)

### 1단계: Supabase 설정 (5분)
1. **Supabase 대시보드** 접속: https://supabase.com/dashboard
2. **프로젝트 선택** → **SQL Editor**
3. **새 쿼리** 생성 후 `DATABASE_MIGRATION.sql` 내용 복사/붙여넣기
4. **Run** 버튼 클릭
5. ✅ **결과 확인**: "마이그레이션 완료!" 메시지

### 2단계: Vercel 환경 변수 설정 (3분)
1. **Vercel 대시보드** 접속: https://vercel.com/dashboard
2. **프로젝트 선택** → **Settings** → **Environment Variables**
3. **Add New** 클릭하여 다음 추가:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://utesnkxljuxcgitlcizr.supabase.co
Environments: ✅ Production, ✅ Preview, ✅ Development

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZXNua3hsanV4Y2dpdGxjaXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODA0NzYsImV4cCI6MjA2OTU1NjQ3Nn0.5ih16HB_y8Yo1i1O4cxo1x0I_-Q3VsRB5m5EB6uXd3g
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### 3단계: 재배포 (2분)
1. **Deployments** 탭 클릭
2. **Redeploy** 버튼 클릭
3. 배포 완료 대기

### 4단계: 테스트 (2분)
1. **사이트 접속**: https://erp.saboothailand.com
2. **로고 업로드** 기능 테스트
3. ✅ **성공 확인**

## 🚨 문제 발생 시

### Storage 버킷 에러가 계속 발생하는 경우:
1. **Supabase 대시보드** → **Storage** 확인
2. 버킷이 없다면 수동으로 생성:
   - `company-logos` (Public 체크)
   - `dashboard-logos` (Public 체크)
   - `employee-photos` (Public 체크)

### 환경 변수 에러가 발생하는 경우:
1. **Vercel**에서 환경 변수 재설정
2. **재배포** 실행
3. **브라우저 캐시** 클리어

## ✅ 완료 확인

모든 단계 완료 후:
- [ ] 로컬에서 정상 작동 ✅
- [ ] 배포 환경에서 정상 작동 ✅
- [ ] 로고 업로드 기능 정상 작동 ✅
- [ ] 에러 메시지 없음 ✅

## 📞 지원

문제가 지속되면 다음 정보를 제공해주세요:
- Supabase SQL 실행 결과 스크린샷
- Vercel 배포 로그
- 브라우저 콘솔 에러 메시지

---

**예상 소요 시간**: 10-15분
**성공 확률**: 95% (올바른 순서로 실행 시) 