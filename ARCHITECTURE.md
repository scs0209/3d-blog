# 프로젝트 폴더 구조 및 설명

이 문서는 **Next.js**와 **FSD(Feature-Sliced Design)** 아키텍처를 결합한 폴더 구조에 대해 설명합니다. 이 구조는 유지보수성과 확장성을 고려하여 설계되었습니다.

아래 폴더 구조는 fsd 아키텍처 예시입니다.

---

## **폴더 구조**

```plaintext
├── app/                   # Next.js App Router 디렉토리 (루트 디렉토리)
│   ├── layout.tsx         # 글로벌 레이아웃 정의
│   ├── page.tsx           # 루트 페이지 (/)
│   ├── about/             # /about 페이지 라우트
│   │   └── page.tsx
│   ├── dashboard/         # /dashboard 페이지 라우트
│   │   ├── layout.tsx     # /dashboard 전용 레이아웃
│   │   └── page.tsx
│   └── api/               # Next.js API 라우트
│       ├── hello/         # /api/hello
│       │   └── route.ts
├── src/
│   ├── app/               # FSD의 글로벌 설정 및 상태 관리
│   │   ├── store/         # 상태 관리 (Redux/Zustand 등)
│   │   ├── providers/     # 글로벌 Providers (예: ThemeProvider, AuthProvider)
│   │   └── config/        # 환경 변수 및 초기 설정
│   ├── views/             # 페이지(View) 레이어
│   │   ├── About/         # /about 페이지
│   │   │   ├── index.ts   # 페이지 진입점
│   │   │   └── ui/        # UI 컴포넌트
│   │   └── Dashboard/     # /dashboard 페이지
│   │       ├── index.ts
│   │       └── ui/
│   ├── widgets/           # 독립적으로 재사용 가능한 UI 컴포넌트
│   ├── features/          # 기능 단위 모듈 (예: 로그인, 회원가입)
│   ├── entities/          # 도메인 엔티티 (예: User, Product)
│   └── shared/            # 공용 모듈 (예: Button, Modal)
├── middleware.ts          # Next.js 미들웨어
├── package.json           # 프로젝트 종속성 및 스크립트
├── tsconfig.json          # TypeScript 설정
└── ...
```

---

## **디렉토리 설명**

### **1. app/** (Next.js App Router)
- Next.js의 **라우팅**과 **페이지 렌더링**을 담당합니다.
- 각 디렉토리가 URL 경로와 매핑됩니다.
- API 라우트(`api/`)와 레이아웃(`layout.tsx`) 파일도 포함됩니다.

#### 예: `/about` 페이지 구성
```plaintext
app/
└── about/
    └── page.tsx           # /about 경로를 처리하는 페이지
```
- **`page.tsx`**:
  ```tsx
  import AboutPage from '@/views/About';

  const About = () => <AboutPage />;
  export default About;
  ```

---

### **2. src/app/** (FSD의 글로벌 설정)
- 전역 상태 관리, 프로바이더, 초기화 코드 등을 포함합니다.

#### 주요 하위 디렉토리
- **`store/`**: Redux, Zustand 등의 상태 관리 설정.
- **`providers/`**: 글로벌 Provider 설정 (예: 테마, 인증).
- **`config/`**: 환경 변수와 앱 초기화 설정.

---

### **3. src/views/** (페이지 레이어)
- 각 페이지를 도메인별로 분리하여 관리합니다.
- View는 페이지에 표시되는 UI와 로직을 담당합니다.

#### 예: `/about` 페이지 구성
```plaintext
views/
└── About/
    ├── index.ts           # 진입점 (컨테이너 역할)
    └── ui/
        ├── AboutPage.tsx  # 메인 컴포넌트
        └── AboutHeader.tsx # 서브 컴포넌트
```
- **`index.ts`**:
  ```tsx
  import AboutPage from './ui/AboutPage';
  export default AboutPage;
  ```

---

### **4. src/widgets/**
- 독립적이고 재사용 가능한 UI 컴포넌트를 관리합니다.
- 특정 페이지나 도메인에 종속되지 않으며 다양한 곳에서 사용됩니다.

---

### **5. src/features/**
- 애플리케이션의 개별 기능(예: 인증, 검색, 필터링 등)을 모듈 단위로 관리합니다.
- 상태 관리, 로직, UI 컴포넌트를 포함할 수 있습니다.

---

### **6. src/entities/**
- 도메인 엔티티(예: 사용자, 제품, 주문 등)를 정의합니다.
- 엔티티 관련 데이터 모델과 비즈니스 로직을 관리합니다.

---

### **7. src/shared/**
- 애플리케이션 전반에서 사용되는 공용 모듈을 관리합니다.
- 예: 버튼, 모달, 유틸리티 함수 등.

---

## **경로 Alias 설정**
- `tsconfig.json`에서 경로 Alias를 설정하여 간단하게 import할 수 있습니다:
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
    }
  }
  ```
- 예: `@/views/About`로 간단히 import 가능.

---

## **폴더 구조 설계 원칙**
1. **관심사 분리**: 페이지, 상태 관리, 공용 모듈을 명확히 구분.
2. **재사용성**: 위젯과 공용 컴포넌트를 통해 코드 중복 최소화.
3. **확장성**: 새로운 기능 추가 시 기존 코드에 최소한의 영향을 미침.

---

이 구조를 통해 FSD와 Next.js의 장점을 결합하여 유지보수성과 생산성을 극대화할 수 있습니다!

