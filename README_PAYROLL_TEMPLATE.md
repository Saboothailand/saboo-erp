# 급여명세서 템플릿 - Saboo (Thailand) Co.,Ltd

태국식 급여명세서 형식과 모던 디자인을 결합한 동적 HTML 템플릿입니다.

## 📁 파일 구조

```
payroll_template.html      # 메인 HTML 파일
payroll_styles.css         # CSS 스타일 파일
payroll_script.js          # JavaScript 기능 파일
README_PAYROLL_TEMPLATE.md # 사용법 설명서
```

## 🚀 주요 기능

### 1. 회사 정보 설정 기능
- **설정 버튼**: 우측 상단 ⚙️ 버튼으로 설정 모달 열기
- **회사 정보 편집**: 회사명, 주소, 전화번호, 이메일 수정
- **로고 업로드**: 이미지 파일 업로드 및 미리보기
- **localStorage 저장**: 브라우저에 설정 자동 저장
- **설정 초기화**: 기본값으로 복원 기능

### 2. 로고 기능
- **기본 로고**: 'S' 문자 또는 회사 이니셜 표시
- **이미지 업로드**: 클릭 또는 드래그 앤 드롭으로 로고 교체
- **크기 제한**: 60×60px, 최대 2MB
- **미리보기**: 업로드 전 이미지 미리보기

### 3. 급여명세서 구조
- **기본 정보**: 직원 정보 (4×2 그리드)
- **세부 내역**: 지급/공제 항목 분할 테이블
- **계산 방법**: 각 항목별 산출식 표시
- **요약 정보**: 총 지급액, 공제액, 실수령액

## 🎨 디자인 스펙

- **메인 컬러**: 연한 분홍색 계열 (#fce4ec, #f8bbd9, #e91e63)
- **폰트**: Noto Sans KR (Google Fonts)
- **반응형**: 모바일 최적화
- **인쇄 최적화**: @media print에서 설정 버튼 숨김

## 📋 사용 방법

### 1. 기본 사용
1. `payroll_template.html` 파일을 브라우저에서 열기
2. 우측 상단 ⚙️ 버튼 클릭하여 설정 모달 열기
3. 회사 정보 및 로고 설정
4. 설정 저장 후 급여명세서 확인

### 2. 로고 업로드
1. 설정 모달에서 "회사 로고" 영역 클릭
2. 이미지 파일 선택 (JPG, PNG, GIF)
3. 또는 이미지를 드래그하여 업로드 영역에 드롭
4. "기본 로고로 복원" 버튼으로 초기화 가능

### 3. 인쇄 및 PDF 저장
- **인쇄**: 🖨️ 인쇄하기 버튼 또는 Ctrl+P
- **PDF 저장**: 📄 PDF 저장 버튼 클릭 후 브라우저에서 "PDF로 저장" 선택
- **데이터 내보내기**: 📊 데이터 내보내기 버튼으로 설정 JSON 파일 다운로드

## ⌨️ 키보드 단축키

- **Ctrl+P**: 인쇄하기
- **Ctrl+S**: 설정 저장 (모달 열린 상태에서)

## 🔧 기술 스펙

### HTML5
- 시맨틱 마크업
- 반응형 이미지
- 접근성 고려

### CSS3
- Flexbox 및 Grid 레이아웃
- CSS 변수 활용
- 애니메이션 및 트랜지션
- 미디어 쿼리

### JavaScript ES6+
- 모듈화된 코드 구조
- localStorage 활용
- FileReader API
- Drag & Drop API

## 📱 반응형 지원

- **데스크톱**: 850px 최대 너비
- **태블릿**: 768px 이하에서 그리드 조정
- **모바일**: 2열 그리드, 터치 친화적 UI

## 🖨️ 인쇄 최적화

- 설정 버튼 및 액션 버튼 숨김
- 배경색 제거
- 그림자 효과 제거
- 페이지 여백 최적화

## 💾 데이터 관리

### localStorage 구조
```json
{
  "companyName": "Saboo (Thailand) Co.,Ltd",
  "companyAddress": "55/20 MOO 4, TAMBON BUNG KHAM PROY...",
  "companyPhone": "TEL. 02-159-9880",
  "companyEmail": "hr@saboo.co.th",
  "logoText": "S",
  "logoImage": "data:image/jpeg;base64,..."
}
```

### 데이터 내보내기/가져오기
- JSON 형식으로 설정 데이터 저장
- 브라우저 간 설정 공유 가능
- 백업 및 복원 기능

## 🎯 예시 데이터

```javascript
const sampleData = {
  company: {
    name: "Saboo (Thailand) Co.,Ltd",
    address: "55/20 MOO 4, TAMBON BUNG KHAM PROY, AMPHUR LAM LUK KA, PATHUM THANI 12150 THAILAND",
    phone: "TEL. 02-159-9880",
    email: "hr@saboo.co.th"
  },
  employee: {
    name: "John Smith",
    empNo: "SB2024001",
    department: "IT Department",
    position: "Senior Developer",
    payPeriod: "2024년 7월"
  },
  salary: {
    basic: 45000,
    allowances: 8000,
    overtime: 5500,
    deductions: 7200,
    netPay: 51300
  }
};
```

## 🔄 업데이트 로그

### v1.0.0 (2025-08-03)
- 초기 버전 릴리즈
- 기본 급여명세서 템플릿
- 회사 정보 설정 기능
- 로고 업로드 기능
- 반응형 디자인
- 인쇄 최적화

## 📞 지원

문제가 발생하거나 개선 사항이 있으시면 개발팀에 문의해주세요.

---

**© 2025 Saboo (Thailand) Co.,Ltd. All rights reserved.** 