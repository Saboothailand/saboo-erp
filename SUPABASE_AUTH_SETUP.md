# 🔐 Supabase Auth 관리자 계정 생성 가이드

## 📧 사용할 이메일 계정

### 테스트용 계정 (권장)
```
이메일: admin@company.com
비밀번호: admin123
```

### 또는 실제 이메일 사용
- 본인의 실제 이메일 주소 사용
- 예: `your-email@gmail.com`

## 🔧 Supabase Auth에서 계정 생성 방법

### 1. Supabase 대시보드 접속
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 (utesnkxljuxcgitlcizr)

### 2. Authentication 설정
1. 왼쪽 메뉴에서 **Authentication** 클릭
2. **Users** 탭 클릭

### 3. 새 사용자 생성
1. **Add user** 버튼 클릭
2. 다음 정보 입력:
   ```
   Email: admin@company.com
   Password: admin123
   ```
3. **Create user** 클릭

### 4. 이메일 확인 (선택사항)
- **Settings** → **Auth** → **Email Templates**
- 이메일 확인을 비활성화하려면 **Enable email confirmations** 체크 해제

## 🚀 즉시 테스트 방법

### 방법 1: HTML 파일에서 직접 테스트
1. `admin-erp.html` 파일을 브라우저에서 열기
2. 이미 입력된 테스트 계정으로 로그인 시도:
   ```
   이메일: admin@company.com
   비밀번호: admin123
   ```

### 방법 2: Supabase 대시보드에서 직접 생성
1. Supabase 대시보드 → Authentication → Users
2. **Add user** 클릭
3. 테스트 계정 정보 입력
4. 생성 후 HTML에서 로그인 테스트

## ⚠️ 주의사항

1. **실제 운영 환경에서는 강력한 비밀번호 사용**
2. **이메일 확인 기능 활성화 권장**
3. **2FA (2단계 인증) 설정 권장**

## 🎯 완료 후 확인

1. Supabase Auth에서 계정 생성 완료
2. HTML 파일에서 로그인 성공
3. 로고 업로드 기능 테스트
4. 모든 기능 정상 작동 확인

---

**🔥 지금 바로 Supabase Auth에서 계정을 생성하고 테스트해보세요!** 