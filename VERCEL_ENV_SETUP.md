# Vercel 환경변수 설정 가이드

## 문제
로고 업로드 실패 - Storage 버킷을 찾을 수 없음

## 해결 방법

### 1. Supabase에서 정보 가져오기
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **API** 클릭
4. 다음 정보 복사:
   - **Project URL** (예: `https://abc123.supabase.co`)
   - **anon public** 키 (긴 문자열)

### 2. Vercel에서 환경변수 설정
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** 탭 클릭
4. **Environment Variables** 섹션에서 **Add New** 클릭
5. 다음 변수들 추가:

```
변수명: NEXT_PUBLIC_SUPABASE_URL
값: https://your-project-ref.supabase.co

변수명: NEXT_PUBLIC_SUPABASE_ANON_KEY  
값: your-anon-key-here
```

### 3. 재배포
1. **Deployments** 탭 클릭
2. **Redeploy** 버튼 클릭
3. 배포 완료 대기

### 4. Supabase Storage 설정
1. Supabase 대시보드 → **Storage**
2. **New bucket** 클릭
3. 다음 버킷들 생성:
   - `company-logos` (Public 체크)
   - `dashboard-logos` (Public 체크)
   - `employee-photos` (Public 체크)

### 5. SQL 스크립트 실행
Supabase SQL Editor에서 `fix_storage_policies.sql` 실행

## 완료 후 테스트
- 애플리케이션 접속
- 로고 업로드 기능 테스트
- 성공하면 문제 해결 완료! 