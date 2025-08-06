# 🚀 Storage 연결 문제 해결 가이드

## 📋 문제 상황
- ✅ Supabase 버킷 생성 완료
- ✅ Public 설정 완료
- ❌ 파일 업로드/다운로드 실패
- ❌ 직원 사진 등록/조회 실패

## 🔧 해결 방법

### 1단계: Supabase SQL 실행 (5분)

**Supabase 대시보드** → **SQL Editor**에서 다음 스크립트 실행:

```sql
-- 🚀 Storage 연결 문제 해결 스크립트
-- 1. 기존 Storage 정책 모두 삭제
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view files" ON storage.objects;

-- 2. Storage 버킷 재생성 (기존 정책 초기화)
DELETE FROM storage.buckets WHERE name IN ('company-logos', 'dashboard-logos', 'employee-photos');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('company-logos', 'company-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('dashboard-logos', 'dashboard-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('employee-photos', 'employee-photos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']);

-- 3. 완전한 공개 접근 정책 생성
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (true);

CREATE POLICY "Public Upload" ON storage.objects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Update" ON storage.objects
    FOR UPDATE USING (true);

CREATE POLICY "Public Delete" ON storage.objects
    FOR DELETE USING (true);

-- 4. RLS 비활성화 (임시로)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

### 2단계: Storage 테스트 (3분)

1. **브라우저에서 테스트 페이지 열기**:
   ```
   file:///Users/kimhwan/Desktop/payroll-management/storage-test.html
   ```

2. **연결 테스트** 버튼 클릭
3. **버킷 목록 확인** 버튼 클릭
4. **파일 업로드 테스트** 실행

### 3단계: 결과 확인

#### ✅ 성공 시나리오:
- 연결 테스트: "연결 성공"
- 버킷 목록: 3개 버킷 표시
- 파일 업로드: 성공 메시지 + 공개 URL 생성

#### ❌ 실패 시나리오:
- 연결 테스트: "연결 실패" + 에러 메시지
- 버킷 목록: "버킷 목록 조회 실패"
- 파일 업로드: "업로드 실패" + 에러 메시지

### 4단계: 문제별 해결

#### 문제 1: "JWT 토큰이 유효하지 않습니다"
**해결 방법**:
1. Vercel 환경 변수 재설정
2. 재배포 실행

#### 문제 2: "버킷을 찾을 수 없습니다"
**해결 방법**:
1. Supabase 대시보드에서 버킷 확인
2. SQL 스크립트 재실행

#### 문제 3: "권한이 없습니다"
**해결 방법**:
1. RLS 정책 재설정
2. 브라우저 캐시 클리어

### 5단계: 애플리케이션 테스트

1. **로컬 테스트**:
   ```bash
   npm run dev
   ```
   - http://localhost:3000 접속
   - 로고 업로드 기능 테스트

2. **배포 테스트**:
   - https://erp.saboothailand.com 접속
   - 로고 업로드 기능 테스트

## 🚨 추가 문제 해결

### Storage 정책 완전 초기화
만약 위 방법으로도 해결되지 않으면:

```sql
-- 완전 초기화
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- RLS 완전 비활성화
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 버킷 재생성
DELETE FROM storage.buckets WHERE name IN ('company-logos', 'dashboard-logos', 'employee-photos');
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('company-logos', 'company-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('dashboard-logos', 'dashboard-logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('employee-photos', 'employee-photos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']);
```

## ✅ 완료 확인

- [ ] SQL 스크립트 실행 완료
- [ ] Storage 테스트 성공
- [ ] 로컬 애플리케이션 테스트 성공
- [ ] 배포 애플리케이션 테스트 성공

## 📞 지원

문제가 지속되면 다음 정보를 제공해주세요:
- Storage 테스트 페이지의 로그 내용
- 브라우저 콘솔 에러 메시지
- Supabase SQL 실행 결과 