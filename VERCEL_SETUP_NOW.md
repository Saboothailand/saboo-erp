# 🚀 Vercel 환경변수 설정 - 즉시 실행!

## ✅ 로컬 환경변수 설정 완료
- `.env.local` 파일 생성됨
- Supabase 연결 정보 설정됨

## 🔧 Vercel 환경변수 설정 (지금 해야 할 일)

### 1. Vercel 대시보드 접속
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. `payroll-management` 프로젝트 선택

### 2. 환경변수 추가
1. **Settings** 탭 클릭
2. **Environment Variables** 섹션에서 **Add New** 클릭
3. 다음 변수들을 **정확히** 입력:

```
변수명: NEXT_PUBLIC_SUPABASE_URL
값: https://utesnkxljuxcgitlcizr.supabase.co
Environment: Production, Preview, Development (모두 체크)

변수명: NEXT_PUBLIC_SUPABASE_ANON_KEY  
값: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZXNua3hsanV4Y2dpdGxjaXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODA0NzYsImV4cCI6MjA2OTU1NjQ3Nn0.5ih16HB_y8Yo1i1O4cxo1x0I_-Q3VsRB5m5EB6uXd3g
Environment: Production, Preview, Development (모두 체크)
```

### 3. 재배포
1. **Deployments** 탭 클릭
2. **Redeploy** 버튼 클릭
3. 배포 완료 대기 (약 2-3분)

## 🎯 완료 후 확인
1. 배포 완료 후 애플리케이션 접속
2. 로고 업로드 기능 테스트
3. 성공하면 문제 해결 완료!

## 📝 참고사항
- 환경변수 설정 후 반드시 재배포 필요
- 모든 Environment (Production, Preview, Development)에 체크
- 변수명은 정확히 `NEXT_PUBLIC_` 접두사 포함

---

**🔥 지금 바로 Vercel에서 환경변수를 설정하세요!** 