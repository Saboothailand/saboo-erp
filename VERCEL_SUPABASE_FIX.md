# Vercel + Supabase 연결 문제 해결 가이드

## 문제 상황
- 로고 업로드 실패: "알 수 없는 오류"
- 시도한 버킷: company-logos, logos, dashboard-logos
- 현재 사용 가능한 버킷: 없음

## 해결 단계

### 1. Supabase 프로젝트 설정 확인

#### 1.1 Supabase 대시보드에서 Storage 버킷 생성
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 해당 프로젝트 선택
3. 왼쪽 메뉴에서 **Storage** 클릭
4. **New bucket** 버튼 클릭
5. 다음 버킷들을 순서대로 생성:

```
버킷 1:
- Name: company-logos
- Public bucket: ✅ 체크
- File size limit: 5MB
- Allowed MIME types: image/jpeg, image/jpg, image/png, image/gif, image/webp

버킷 2:
- Name: dashboard-logos  
- Public bucket: ✅ 체크
- File size limit: 5MB
- Allowed MIME types: image/jpeg, image/jpg, image/png, image/gif, image/webp

버킷 3:
- Name: employee-photos
- Public bucket: ✅ 체크
- File size limit: 5MB
- Allowed MIME types: image/jpeg, image/jpg, image/png, image/gif, image/webp
```

#### 1.2 Storage RLS 정책 설정
Supabase SQL Editor에서 다음 스크립트 실행:

```sql
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- 모든 사용자에게 완전한 접근 권한 부여
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (true);

CREATE POLICY "Public Upload" ON storage.objects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Update" ON storage.objects
    FOR UPDATE USING (true);

CREATE POLICY "Public Delete" ON storage.objects
    FOR DELETE USING (true);
```

### 2. Vercel 환경변수 설정

#### 2.1 Vercel 대시보드에서 환경변수 설정
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 해당 프로젝트 선택
3. **Settings** 탭 클릭
4. **Environment Variables** 섹션에서 다음 변수들 추가:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 2.2 Supabase에서 URL과 Key 가져오기
1. Supabase 대시보드 → Settings → API
2. **Project URL** 복사 → `NEXT_PUBLIC_SUPABASE_URL`에 붙여넣기
3. **anon public** 키 복사 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 붙여넣기

### 3. 로컬 개발 환경 설정 (선택사항)

#### 3.1 .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. 배포 및 테스트

#### 4.1 Vercel 재배포
1. Vercel 대시보드에서 **Deployments** 탭
2. **Redeploy** 버튼 클릭
3. 또는 GitHub에 커밋 푸시하여 자동 배포

#### 4.2 테스트
1. 배포 완료 후 애플리케이션 접속
2. 로고 업로드 기능 테스트
3. 브라우저 개발자 도구에서 콘솔 로그 확인

### 5. 문제 해결 체크리스트

- [ ] Supabase Storage 버킷 3개 모두 생성됨
- [ ] Storage RLS 정책 설정됨
- [ ] Vercel 환경변수 설정됨
- [ ] 프로젝트 재배포 완료
- [ ] 로고 업로드 테스트 성공

### 6. 추가 디버깅

#### 6.1 브라우저 콘솔에서 확인할 로그
```javascript
// 다음 로그들이 정상적으로 출력되는지 확인
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)
console.log('Supabase client created successfully')
```

#### 6.2 Supabase 연결 테스트
브라우저 콘솔에서:
```javascript
// Storage 버킷 목록 확인
const { data: buckets, error } = await supabase.storage.listBuckets()
console.log('Available buckets:', buckets)
```

## 주의사항

1. **환경변수 이름**: 반드시 `NEXT_PUBLIC_` 접두사 사용
2. **버킷 이름**: 정확히 `company-logos`, `dashboard-logos`, `employee-photos` 사용
3. **Public bucket**: 반드시 체크해야 함
4. **재배포**: 환경변수 변경 후 반드시 재배포 필요

## 문제가 지속되는 경우

1. Supabase 프로젝트가 활성 상태인지 확인
2. 네트워크 연결 상태 확인
3. 브라우저 캐시 삭제
4. Vercel 로그에서 오류 메시지 확인 