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
│   ├── shared/            # 공용 유틸 (예: Button, Modal)
│   └── shadcn-ui/         # ShadCN UI 컴포넌트 관리 디렉토리
│       ├── components/    # ShadCN의 기본 컴포넌트
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   └── Modal.tsx
│       └── lib/         # ShadCN 관련 유틸리티 (예: 클래스 머지)
│           └── utils.ts
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
- 애플리케이션 전반에서 사용되는 공용 유틸을 관리합니다.
- 예: 버튼, 모달, 유틸리티 함수 등.

---

### **8. src/shadcn-ui/**

- ShadCN UI 컴포넌트를 효율적으로 관리하기 위한 디렉토리.

#### 주요 하위 디렉토리

- ``: ShadCN 기본 컴포넌트 (Button, Input, Modal 등).
- ``: 글로벌 스타일 확장 및 ShadCN 컴포넌트 커스터마이징.
- ``: ShadCN 관련 유틸리티 함수 (예: `clsx`나 `classnames` 래퍼).

#### 예: `Button.tsx`

```tsx
import { cn } from '@/src/shadcn-ui/utils/classMerge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ className, variant = 'primary', ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md text-white',
        variant === 'primary' && 'bg-blue-500 hover:bg-blue-600',
        variant === 'secondary' && 'bg-gray-500 hover:bg-gray-600',
        className
      )}
      {...props}
    />
  );
};
```

#### 예: `classMerge.ts`

```ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

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
- 예: `@/shadcn-ui/components/Button`로 간단히 import 가능.

---

## **폴더 구조 설계 원칙**

1. **관심사 분리**: 페이지, 상태 관리, 공용 유틸을 명확히 구분.
2. **재사용성**: 위젯과 공용 컴포넌트를 통해 코드 중복 최소화.
3. **확장성**: 새로운 기능 추가 시 기존 코드에 최소한의 영향을 미침.

---

## **Server Component vs Client Component**

이 프로젝트는 Next.js App Router의 **React Server Components(RSC)** 를 기본으로 씁니다.  
파일 상단에 `'use client'`가 없으면 **서버 컴포넌트**, 있으면 **클라이언트 컴포넌트**입니다.

### 기본 규칙

| 구분 | 위치 / 예시 | 역할 |
|------|-------------|------|
| **Server (기본)** | `app/**/page.tsx`, `layout.tsx`, `loading.tsx`, `app/api/**/route.ts` | 라우트 진입, 데이터 fetch, SEO/metadata, API |
| **Server 가능** | `src/entities/**/lib/*` (순수 함수, `'use client'` 없음) | 트리 빌드, 도메인 변환 등 공유 유틸 |
| **Client** | `'use client'`가 있는 `widgets` / `features` UI | 클릭·폼·모달·애니메이션·브라우저 API·React Query |

### 언제 클라이언트로 두나

다음이 필요하면 `'use client'`를 둡니다.

- `useState` / `useEffect` / `useTransition` 등 훅
- `onClick`, 폼 입력, 모달 open 상태
- `framer-motion`, `next/navigation`의 `useRouter` / `usePathname`
- TanStack Query (`useQuery`) 등 브라우저 캐시 훅
- `window`, `localStorage` 등 브라우저 전용 API

데이터만 가져와 그리기만 하면 **서버 컴포넌트**로 유지합니다.

### 이 프로젝트에서의 실제 배치

```plaintext
app/
  (public)/blog/(posts)/.../page.tsx   # Server: 포스트 fetch + 렌더 (예: post detail)
  (public)/blog/(posts)/layout.tsx     # Server: 셸 조립 (자식에 Client 위젯 포함 가능)
  (protect)/admin/categories/page.tsx  # Server: 페이지 껍데기
  api/category/**/route.ts             # Server: REST API

src/
  entities/category/lib/               # Server·Client 모두 import 가능 (순수 함수)
    build-category-tree.ts
    to-category-list-item.ts
  widgets/post/ui/
    Sidebar.tsx                        # Client: 라우팅·사이드바 토글
    CategoryTree.tsx                   # Client: 접기/펼치기·클릭
  widgets/admin/category/              # Client: 관리자 CRUD·모달
  features/category/ui/category-form.tsx  # Client: react-hook-form
```

### 조합 패턴 (권장)

1. **`app/.../page.tsx`(Server)** 가 데이터를 가져오거나, 클라이언트 위젯만 마운트한다.
2. **인터랙션 UI는 Client 위젯/피처**로 분리한다 (`CategoryTree`, `CategoryManagement` 등).
3. **트리 변환·타입 정규화 같은 순수 로직**은 `entities/**/lib`에 두고 Server/Client 어디서든 import한다.
4. Client 경계를 불필요하게 넓히지 않는다. 정적 마크업·metadata·초기 HTML은 Server에 남긴다.

### 체크리스트

- [ ] 이 파일에 훅/이벤트/브라우저 API가 있는가? → 있으면 Client
- [ ] 없으면 Server로 두고, 필요한 자식만 Client로 분리했는가?
- [ ] API 변경 시 `pnpm run generate-types`로 OpenAPI 타입을 맞췄는가?

---

이 구조를 통해 FSD와 ShadCN UI를 효과적으로 결합하여 생산성과 유지보수성을 극대화할 수 있습니다!
