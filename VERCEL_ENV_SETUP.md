# 🚀 Vercel 환경 변수 설정 가이드

## 📋 필수 환경 변수

다음 환경 변수들을 Vercel에 설정해야 합니다:

### 1. Supabase URL
- **변수명**: `NEXT_PUBLIC_SUPABASE_URL`
- **값**: `https://utesnkxljuxcgitlcizr.supabase.co`

### 2. Supabase Anon Key
- **변수명**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **값**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZXNua3hsanV4Y2dpdGxjaXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODA0NzYsImV4cCI6MjA2OTU1NjQ3Nn0.5ih16HB_y8Yo1i1O4cxo1x0I_-Q3VsRB5m5EB6uXd3g`

## 🔧 설정 방법

1. **Vercel 대시보드** 접속
2. **프로젝트 선택** → **Settings** → **Environment Variables**
3. **Add New** 클릭
4. 위의 변수명과 값을 정확히 입력
5. **Production, Preview, Development** 모두 체크
6. **Save** 클릭

## ✅ 확인 방법

설정 후 **Redeploy**를 실행하여 변경사항을 적용하세요.

## 🚨 주의사항

- 변수명은 정확히 입력해야 합니다 (대소문자 구분)
- 값에 공백이나 따옴표가 없어야 합니다
- 설정 후 반드시 재배포가 필요합니다 