# 🚨 파일 업로드 후 화면에 표시되지 않는 문제 해결

## 📋 문제 상황
- ✅ Supabase Storage에 파일 업로드 성공
- ✅ `test-1754410258097-thai-kim.png` 파일 존재 확인
- ❌ 애플리케이션에서 파일이 보이지 않음
- ❌ 직원 사진 변경 안됨
- ❌ 회사 로고 변경 안됨

## 🔍 원인 분석
파일은 Storage에 업로드되었지만, **데이터베이스 테이블에 파일 정보가 저장되지 않음**

## 🔧 해결 방법

### 1단계: 데이터베이스 테이블 확인 및 수정

#### 1.1 Supabase SQL Editor에서 실행:
```sql
-- 직원 테이블에 사진 관련 컬럼 추가
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS photo_filename TEXT;

-- 회사 설정 테이블 생성
CREATE TABLE IF NOT EXISTS company_settings (
    id SERIAL PRIMARY KEY,
    company_name TEXT,
    company_address TEXT,
    phone_number TEXT,
    email TEXT,
    website_url TEXT,
    logo_url TEXT,
    logo_filename TEXT,
    dashboard_logo_url TEXT,
    dashboard_logo_filename TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 대시보드 설정 테이블 생성
CREATE TABLE IF NOT EXISTS dashboard_settings (
    id SERIAL PRIMARY KEY,
    default_screen TEXT DEFAULT 'dashboard',
    theme TEXT DEFAULT 'light',
    logo_url TEXT,
    logo_filename TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 데이터 삽입
INSERT INTO company_settings (company_name, company_address, phone_number, email, website_url)
VALUES ('Saboo Thailand', 'Bangkok, Thailand', '+66-2-123-4567', 'info@saboothailand.com', 'https://saboothailand.com')
ON CONFLICT DO NOTHING;

INSERT INTO dashboard_settings (default_screen, theme)
VALUES ('dashboard', 'light')
ON CONFLICT DO NOTHING;
```

### 2단계: 테스트용 파일 정보 수동 추가

#### 2.1 회사 로고 정보 추가:
```sql
-- 기존 회사 설정 업데이트
UPDATE company_settings 
SET 
    logo_url = 'https://utesnkxljuxcgitlcizr.supabase.co/storage/v1/object/public/company-logos/test-1754410258097-thai-kim.png',
    logo_filename = 'test-1754410258097-thai-kim.png'
WHERE id = 1;
```

#### 2.2 직원 사진 정보 추가 (예시):
```sql
-- 첫 번째 직원에게 사진 정보 추가
UPDATE employees 
SET 
    photo_url = 'https://utesnkxljuxcgitlcizr.supabase.co/storage/v1/object/public/employee-photos/test-1754410258097-thai-kim.png',
    photo_filename = 'test-1754410258097-thai-kim.png'
WHERE id = 1;
```

### 3단계: 애플리케이션 코드 확인

#### 3.1 파일 업로드 후 데이터베이스 저장 확인
애플리케이션에서 파일 업로드 후 다음 정보가 데이터베이스에 저장되는지 확인:
- `photo_url` 또는 `logo_url`
- `photo_filename` 또는 `logo_filename`

#### 3.2 파일 표시 로직 확인
애플리케이션에서 파일을 표시할 때:
- 데이터베이스의 URL을 사용하는지
- 파일이 없을 때 기본 이미지를 표시하는지

### 4단계: 브라우저 캐시 클리어

#### 4.1 강제 새로고침:
- **Mac**: `Cmd + Shift + R`
- **Windows**: `Ctrl + F5`

#### 4.2 시크릿 모드 테스트:
- **Chrome**: `Cmd + Shift + N`
- **Safari**: `Cmd + Shift + N`

### 5단계: 테스트

#### 5.1 로컬 테스트:
```bash
npm run dev
```
- http://localhost:3001 접속
- 직원 정보 수정에서 사진 확인
- 회사 설정에서 로고 확인

#### 5.2 배포 테스트:
- https://erp.saboothailand.com 접속
- 동일한 기능들 테스트

## 🚨 추가 문제 해결

### 문제 1: 파일 URL이 잘못됨
**해결**: Supabase Storage에서 **Get URL** 버튼으로 정확한 URL 복사

### 문제 2: 데이터베이스에 정보가 저장되지 않음
**해결**: 애플리케이션의 파일 업로드 로직 확인

### 문제 3: 화면에 표시되지 않음
**해결**: 브라우저 개발자 도구에서 네트워크 탭 확인

## ✅ 완료 확인

- [ ] 데이터베이스 테이블 생성 완료
- [ ] 파일 정보 수동 추가 완료
- [ ] 브라우저 캐시 클리어 완료
- [ ] 로컬에서 파일 표시 확인
- [ ] 배포 환경에서 파일 표시 확인

## 📞 다음 단계

1. **SQL 스크립트 실행** 후 결과 알려주세요
2. **파일 정보 수동 추가** 후 결과 알려주세요
3. **애플리케이션에서 파일 표시** 확인 후 결과 알려주세요 