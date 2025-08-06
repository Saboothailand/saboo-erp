# 🚨 Supabase Storage 버킷 직접 생성 가이드

## 📋 문제 상황
- Vercel 환경 변수 설정 완료
- 재배포 완료
- 여전히 "Storage 버킷이 없습니다" 에러 발생

## 🔧 해결 방법: Supabase 대시보드에서 직접 생성

### 1단계: Supabase 대시보드 접속
1. **Supabase 대시보드**: https://supabase.com/dashboard
2. **프로젝트 선택**: `utesnkxljuxcgitlcizr` 프로젝트
3. **Storage** 메뉴 클릭

### 2단계: company-logos 버킷 생성
1. **New bucket** 버튼 클릭
2. **Name**: `company-logos` 입력
3. **Public bucket**: ✅ 체크
4. **File size limit**: `5MB` (기본값)
5. **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/gif, image/webp`
6. **Create bucket** 클릭

### 3단계: dashboard-logos 버킷 생성
1. **New bucket** 버튼 클릭
2. **Name**: `dashboard-logos` 입력
3. **Public bucket**: ✅ 체크
4. **File size limit**: `5MB` (기본값)
5. **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/gif, image/webp`
6. **Create bucket** 클릭

### 4단계: employee-photos 버킷 생성
1. **New bucket** 버튼 클릭
2. **Name**: `employee-photos` 입력
3. **Public bucket**: ✅ 체크
4. **File size limit**: `5MB` (기본값)
5. **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/gif, image/webp`
6. **Create bucket** 클릭

### 5단계: 버킷 목록 확인
Storage 페이지에서 다음 3개 버킷이 표시되는지 확인:
- ✅ `company-logos` (Public)
- ✅ `dashboard-logos` (Public)
- ✅ `employee-photos` (Public)

## 🚀 대안 방법: SQL 스크립트 실행

만약 대시보드에서 생성이 안 되면:

### Supabase SQL Editor에서 실행:
```sql
-- Storage 버킷 강제 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('company-logos', 'company-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('dashboard-logos', 'dashboard-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('employee-photos', 'employee-photos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- Storage 정책 설정
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (true);

-- RLS 비활성화
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

## ✅ 완료 확인

### 버킷 생성 확인:
1. **Supabase 대시보드** → **Storage**
2. 3개 버킷이 모두 표시되는지 확인
3. 각 버킷이 **Public**으로 설정되어 있는지 확인

### 애플리케이션 테스트:
1. **로컬 테스트**: http://localhost:3001
2. **배포 테스트**: https://erp.saboothailand.com
3. **로고 업로드** 기능 테스트

## 🚨 문제 지속 시

만약 여전히 문제가 발생하면:
1. **브라우저 캐시 완전 클리어**
2. **시크릿 모드**에서 테스트
3. **다른 브라우저**에서 테스트
4. **Vercel 재배포** (Clear Cache and Redeploy)

---

**예상 소요 시간**: 10-15분  
**성공 확률**: 99% (버킷이 실제로 생성되는 경우) 