# 🚨 긴급! Vercel 환경 변수 설정

## 📋 문제 상황
- ✅ 로컬: Storage 연결 정상 (http://localhost:3001)
- ❌ 배포: Storage 버킷 에러 (erp.saboothailand.com)
- 🔍 원인: Vercel 환경 변수 미설정

## 🚀 즉시 해결 방법

### 1단계: Vercel 대시보드 접속
1. **Vercel 대시보드**: https://vercel.com/dashboard
2. **프로젝트 선택**: `saboo-erp` 또는 해당 프로젝트
3. **Settings** 탭 클릭
4. **Environment Variables** 섹션으로 이동

### 2단계: 환경 변수 추가
**Add New** 버튼을 클릭하여 다음 변수들을 **정확히** 추가:

#### 변수 1: Supabase URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://utesnkxljuxcgitlcizr.supabase.co
Environments: ✅ Production, ✅ Preview, ✅ Development
```

#### 변수 2: Supabase Anon Key
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZXNua3hsanV4Y2dpdGxjaXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODA0NzYsImV4cCI6MjA2OTU1NjQ3Nn0.5ih16HB_y8Yo1i1O4cxo1x0I_-Q3VsRB5m5EB6uXd3g
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### 3단계: 저장 및 재배포
1. **Save** 버튼 클릭
2. **Deployments** 탭 클릭
3. **Redeploy** 버튼 클릭 (최신 배포에서)
4. 배포 완료 대기 (약 2-3분)

### 4단계: 테스트
1. **사이트 접속**: https://erp.saboothailand.com
2. **로고 업로드** 기능 테스트
3. **직원 사진 업로드** 기능 테스트

## 🚨 주의사항

### 환경 변수 설정 시 확인사항:
- [ ] 변수명이 **정확히** 입력됨 (대소문자 구분)
- [ ] 값에 **공백이나 따옴표** 없음
- [ ] **Production, Preview, Development** 모두 체크됨
- [ ] **Save** 버튼 클릭 완료

### 재배포 후 확인사항:
- [ ] 배포 로그에서 에러 없음
- [ ] 환경 변수 로드 성공
- [ ] Supabase 연결 성공

## 📞 문제 지속 시

만약 위 방법으로도 해결되지 않으면:

1. **기존 환경 변수 삭제** 후 재설정
2. **브라우저 캐시 클리어**
3. **강제 새로고침** (Ctrl+F5 또는 Cmd+Shift+R)

## ✅ 완료 확인

- [ ] Vercel 환경 변수 설정 완료
- [ ] 재배포 완료
- [ ] erp.saboothailand.com에서 로고 업로드 성공
- [ ] Storage 버킷 에러 메시지 사라짐

---

**예상 소요 시간**: 5-10분  
**성공 확률**: 95% (환경 변수 설정이 올바른 경우) 