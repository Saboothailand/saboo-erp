# 🚨 Vercel 최종 설정 및 재배포 가이드

## 📋 문제 상황
- Supabase와 Vercel 연동 문제
- TablePlus에서 테이블 생성 실패
- 직원 사진 업로드 후 변경 안됨
- 회사 로고 업로드 안됨

## 🔧 해결 방법

### 1단계: Supabase 데이터베이스 완전 초기화

**Supabase SQL Editor**에서 `COMPLETE_DATABASE_FIX.sql` 실행

### 2단계: Vercel 환경 변수 재확인

#### 2.1 Vercel 대시보드 접속
1. **Vercel 대시보드**: https://vercel.com/dashboard
2. **프로젝트 선택** → **Settings** → **Environment Variables**

#### 2.2 기존 환경 변수 삭제
1. `NEXT_PUBLIC_SUPABASE_URL` 옆의 **점 세 개** 클릭 → **Delete**
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` 옆의 **점 세 개** 클릭 → **Delete**

#### 2.3 새로운 환경 변수 추가
**Add New** 버튼을 클릭하여 다음 변수들을 **정확히** 추가:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://utesnkxljuxcgitlcizr.supabase.co
Environments: ✅ Production, ✅ Preview, ✅ Development

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZXNua3hsanV4Y2dpdGxjaXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODA0NzYsImV4cCI6MjA2OTU1NjQ3Nn0.5ih16HB_y8Yo1i1O4cxo1x0I_-Q3VsRB5m5EB6uXd3g
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### 3단계: 완전 재배포

#### 3.1 캐시 클리어 및 재배포
1. **Deployments** 탭 클릭
2. **최신 배포**에서 **점 세 개** 클릭
3. **"Clear Cache and Redeploy"** 선택
4. 배포 완료 대기 (3-5분)

#### 3.2 배포 로그 확인
배포 중 다음 항목들이 성공하는지 확인:
- ✅ Environment Variables Loaded
- ✅ Supabase Connection Success
- ✅ Build Completed Successfully

### 4단계: 브라우저 캐시 완전 클리어

#### 4.1 강제 새로고침
- **Windows**: `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

#### 4.2 시크릿 모드 테스트
- **Chrome**: `Ctrl + Shift + N`
- **Safari**: `Cmd + Shift + N`
- **Firefox**: `Ctrl + Shift + P`

### 5단계: 기능 테스트

#### 5.1 로컬 테스트
```bash
npm run dev
```
- http://localhost:3001 접속
- 직원 사진 업로드 테스트
- 회사 로고 업로드 테스트

#### 5.2 배포 테스트
- https://erp.saboothailand.com 접속
- 동일한 기능들 테스트

## 🚨 문제별 해결

### 문제 1: "Storage 버킷이 없습니다"
**해결**: `COMPLETE_DATABASE_FIX.sql` 재실행

### 문제 2: "직원 사진 변경 안됨"
**해결**: 브라우저 캐시 클리어 + 재배포

### 문제 3: "회사 로고 업로드 안됨"
**해결**: 환경 변수 재설정 + 재배포

### 문제 4: "TablePlus 연결 실패"
**해결**: Supabase 프로젝트 상태 확인

## ✅ 완료 확인 체크리스트

### Supabase 설정:
- [ ] `COMPLETE_DATABASE_FIX.sql` 실행 완료
- [ ] Storage 버킷 3개 생성 확인
- [ ] 테이블 생성 확인
- [ ] 정책 설정 확인

### Vercel 설정:
- [ ] 기존 환경 변수 삭제 완료
- [ ] 새로운 환경 변수 추가 완료
- [ ] Clear Cache and Redeploy 완료
- [ ] 배포 로그 성공 확인

### 브라우저 테스트:
- [ ] 캐시 클리어 완료
- [ ] 로컬 테스트 성공
- [ ] 배포 테스트 성공
- [ ] 파일 업로드/변경 성공

## 📞 최종 확인

모든 단계 완료 후:
1. **직원 정보 수정**에서 사진 업로드 테스트
2. **회사 설정**에서 로고 업로드 테스트
3. **파일 변경**이 정상적으로 반영되는지 확인

---

**예상 소요 시간**: 15-20분  
**성공 확률**: 99% (모든 단계를 정확히 수행한 경우) 