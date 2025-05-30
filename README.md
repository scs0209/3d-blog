# 블로깅 플랫폼 (Blogging Platform)

Next.js, TypeScript, Prisma, Tailwind CSS를 사용하여 구축된 블로깅 플랫폼입니다.

## 주요 기술 (Key Technologies)

*   **Next.js:** 서버 사이드 렌더링 및 정적 생성을 지원하는 React 프레임워크입니다. (App Router 사용)
*   **TypeScript:** JavaScript의 상위 집합으로, 정적 타입을 제공하여 코드 안정성을 높입니다.
*   **Prisma:** 현대적인 데이터베이스 툴킷으로, 데이터베이스와의 상호작용을 쉽게 만듭니다.
*   **Tailwind CSS:** 유틸리티 우선 CSS 프레임워크로, 사용자 인터페이스를 빠르게 구축할 수 있습니다.
*   **React Three Fiber:** React 애플리케이션에서 Three.js를 사용하여 3D 그래픽을 렌더링하기 위한 라이브러리입니다.

## API 타입 자동 생성 (openapi-typescript)

이 프로젝트는 `openapi-typescript` 도구를 사용하여 OpenAPI Specification (Swagger) 명세로부터 TypeScript 타입을 자동으로 생성합니다. 이를 통해 프론트엔드에서 API와 상호작용할 때 타입 안전성을 보장하고, API 변경 사항에 대한 빠른 대응을 가능하게 합니다.

*   **타입 생성 스크립트:** 다음 명령어를 사용하여 타입을 생성할 수 있습니다.
    ```sh
    npm run generate-types
    ```
    (내부적으로 `sh scripts/generate-types.sh` 스크립트를 실행할 수 있습니다.)

*   **생성된 타입 위치:** 생성된 타입 정의 파일은 다음 경로에 위치합니다.
    `src/shared/api/openapi-types.ts`

*   **목적:** API 응답 및 요청 객체에 대한 정확한 타입을 제공하여 개발 과정에서의 오류를 줄이고, 보다 안정적인 애플리케이션 개발을 지원합니다.

## 주요 기능 (Project Features)

*   **블로그 관리:**
    *   게시물 생성, 조회, 수정 및 삭제 (CRUD) 기능
    *   마크다운 또는 위지윅 에디터를 사용한 콘텐츠 작성
*   **콘텐츠 조직화:**
    *   게시물 분류를 위한 카테고리 기능
    *   세부 주제별 분류를 위한 태그 기능
*   **사용자 인증:**
    *   회원가입, 로그인 및 로그아웃 기능
    *   (선택 사항) 소셜 로그인 지원
*   **검색:**
    *   게시물 제목 및 내용 검색 기능
*   **(선택 사항) 3D 요소 통합:**
    *   `react-three-fiber`를 활용하여 블로그 게시물 내에 인터랙티브 3D 모델 또는 시각화 포함 가능
*   **관리자 페이지 (Admin Page):**
    *   **목적:** 플랫폼의 전반적인 콘텐츠, 사용자 및 설정을 관리하기 위한 전용 인터페이스입니다.
    *   **주요 기능:**
        *   **대시보드:** 사이트 통계, 최근 활동 등 주요 정보 요약.
        *   **콘텐츠 관리:** 게시물 생성, 수정, 삭제, 게시 승인/거부.
        *   **사용자 관리:** 사용자 목록 조회, 역할 변경, 사용자 계정 관리.
        *   **카테고리 및 태그 관리:** 카테고리 및 태그 생성, 수정, 삭제.
        *   **(선택 사항) 댓글 관리:** 댓글 승인, 스팸 처리, 삭제.
        *   **(선택 사항) 사이트 설정:** 사이트 제목, 테마, 플러그인 등 일반 설정 변경.

## 아키텍처 패턴: Feature-Sliced Design (FSD)

이 프로젝트는 확장 가능하고 유지보수하기 쉬운 코드베이스를 구축하기 위해 **Feature-Sliced Design (FSD)** 아키텍처 패턴을 채택합니다. FSD는 애플리케이션을 비즈니스 도메인과 범위에 따라 계층화된 슬라이스(Slices)로 분할하는 방법론입니다.

FSD의 주요 목표는 다음과 같습니다:
*   **높은 응집도 (High Cohesion):** 각 모듈(슬라이스, 세그먼트)은 특정 기능에 집중합니다.
*   **낮은 결합도 (Low Coupling):** 모듈 간의 의존성을 최소화하여 변경 용이성을 높입니다.
*   **명확한 경계:** 각 모듈의 책임과 역할이 명확히 구분됩니다.
*   **재사용성:** 공통 로직과 UI 컴포넌트의 재사용을 장려합니다.

### FSD 레이어 구조 및 Next.js App Router와의 통합

FSD 레이어는 `src` 디렉토리 내에 구성되며, Next.js App Router 환경과의 통합은 다음과 같이 고려됩니다:

1.  **루트 `app/` (Next.js App Router 디렉토리):**
    *   Next.js의 App Router 시스템에 의해 관리되는 프로젝트 루트 레벨의 디렉토리입니다.
    *   **라우팅, 최상위 레이아웃 (`layout.tsx`), 페이지 컴포넌트 (`page.tsx`) 정의**의 핵심 역할을 합니다.
    *   각 라우트 세그먼트 (예: `app/(main)/dashboard/`)는 자체 `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` 등을 가질 수 있습니다.
    *   이 디렉토리 구조 자체가 애플리케이션의 페이지 구성과 라우팅을 담당합니다. `page.tsx` 파일들은 FSD의 `views` 레이어에 있는 컴포넌트를 주로 사용합니다.

2.  **`src/app/` (FSD 애플리케이션 레이어):**
    *   FSD의 `app` 레이어에 해당합니다. Next.js의 루트 `app/` 디렉토리와는 역할이 구분됩니다.
    *   이 레이어는 애플리케이션 **전역 설정(환경 변수 등), 상태 관리 프로바이더(Context API, Zustand 스토어 등), 핵심 초기화 로직, 전역 스타일** (루트 `app/layout.tsx`에서 처리되지 않는 애플리케이션 전반의 스타일) 등을 포함합니다.
    *   예: `src/app/providers` (Context API 프로바이더 등), `src/app/styles` (전역 CSS 변수, 기본 스타일), `src/app/lib` (초기화 함수, 전역 헬퍼)

3.  **`src/views/` (FSD 뷰 레이어):**
    *   FSD의 전통적인 `pages` 레이어에 해당하며, 사용자에게 보여지는 **페이지 레벨의 UI 컴포넌트 또는 특정 페이지를 위한 위젯과 기능의 조합**을 나타냅니다.
    *   `views` 컴포넌트들은 주로 **루트 `app/` 디렉토리 내의 `page.tsx` 파일에서 직접 사용**되어 해당 경로의 최종 UI를 구성합니다.
    *   각 뷰는 특정 페이지 또는 복잡한 섹션에 대한 UI 로직과 상태를 캡슐화하며, `widgets`와 `features`를 조합하여 구성됩니다.
    *   예: `src/views/DashboardView.tsx`, `src/views/PostDetailView.tsx`, `src/views/AdminPanelView.tsx`

4.  **`src/widgets/` (FSD 위젯 레이어):**
    *   독립적으로 기능하며, 여러 페이지(뷰)에서 재사용될 수 있는 더 큰 UI 블록입니다. (예: 헤더, 푸터, 게시물 목록, 사이드바)
    *   내부적으로 `features`와 `entities`를 포함할 수 있습니다.
    *   예: `src/widgets/Header`, `src/widgets/PostFeed`, `src/widgets/UserProfileCard`

5.  **`src/features/` (FSD 기능 레이어):**
    *   사용자 스토리와 직접적으로 관련된 기능적 요소들입니다. (예: 게시물 작성, 사용자 로그인, 댓글 달기)
    *   상호작용 로직, UI 컴포넌트, API 호출 등을 포함할 수 있습니다.
    *   예: `src/features/auth/login`, `src/features/post/create-post-button`, `src/features/comment/add-comment-form`

6.  **`src/entities/` (FSD 엔티티 레이어):**
    *   애플리케이션의 핵심 비즈니스 엔티티를 나타냅니다. (예: 사용자, 게시물, 댓글)
    *   주로 데이터 구조(타입/인터페이스), 관련 UI 컴포넌트(카드, 목록 아이템), 그리고 엔티티를 다루는 간단한 로직(예: 포맷팅 함수)을 포함합니다.
    *   예: `src/entities/User/ui/UserAvatar.tsx`, `src/entities/Post/model/types.ts`, `src/entities/Comment/lib/formatComment.ts`

7.  **`src/shared/` (FSD 공유 레이어):**
    *   애플리케이션 전반에서 사용될 수 있는 재사용 가능한 로직, UI 컴포넌트, 유틸리티, 설정 등을 포함합니다.
    *   다른 FSD 레이어(`app`, `views`, `widgets`, `features`, `entities`)에 대한 의존성이 없어야 합니다.
    *   예: `src/shared/ui/Button`, `src/shared/lib/hooks`, `src/shared/api/axiosInstance.ts`, `src/shared/config/constants.ts`

### FSD 규칙

*   **단방향 의존성:** 레이어는 아래 방향으로만 의존할 수 있습니다. (예: `features`는 `entities`나 `shared`를 사용할 수 있지만, `entities`는 `features`를 사용할 수 없습니다. `views`는 `widgets`, `features`, `entities`, `shared`를 사용할 수 있습니다.)
*   **슬라이스 간 격리:** 한 `features` (또는 `entities`, `widgets`) 슬라이스는 다른 슬라이스의 내부 구현에 직접 접근해서는 안 됩니다. 필요하다면 `shared` 레이어를 통해 통신하거나, 상위 레이어에서 조정합니다.

이러한 FSD 구조를 통해 프로젝트가 성장함에 따라 복잡성을 관리하고, 팀원 간의 협업을 용이하게 하며, 코드의 예측 가능성을 높일 수 있습니다.

## `react-three-fiber` 활용 (Usage of `react-three-fiber`)

`react-three-fiber`는 이 프로젝트에서 다음과 같은 방식으로 활용될 수 있습니다 (또는 활용될 예정입니다):

*   **인터랙티브 3D 콘텐츠:** 특정 블로그 게시물에서 3D 모델을 표시하거나, 사용자와 상호작용하는 3D 그래픽을 구현할 수 있습니다. 예를 들어, 제품 리뷰, 건축 시각화, 예술 작품 소개 등에 활용될 수 있습니다.
*   **데이터 시각화:** 복잡한 데이터를 3D 차트나 그래프로 표현하여 사용자 이해를 돕습니다.
*   **웹사이트의 미적 요소 강화:** 홈페이지의 히어로 섹션이나 특정 페이지 배경에 동적인 3D 애니메이션을 추가하여 사용자 경험을 향상시킬 수 있습니다.

`react-three-fiber`의 컴포넌트 기반 접근 방식은 기존 React 코드베이스와 자연스럽게 통합되며, Three.js의 강력한 기능을 선언적으로 사용할 수 있게 해줍니다.

## 시작하기 (Getting Started)

로컬 환경에서 프로젝트를 실행하려면 다음 단계를 따르세요.

### 사전 요구 사항 (Prerequisites)

*   Node.js (v16 이상)
*   npm 또는 yarn

### 설치 (Installation)

1.  저장소 복제:
    ```sh
    git clone https://github.com/your_username/blogging-platform.git
    ```
2.  NPM 패키지 설치:
    ```sh
    npm install
    # 또는
    yarn install
    ```
3.  데이터베이스 설정:
    *   프로젝트 루트에 `.env` 파일을 생성합니다.
    *   `.env` 파일에 데이터베이스 연결 문자열을 추가합니다:
        ```
        DATABASE_URL="your_database_connection_string"
        ```
    *   Prisma 마이그레이션 실행:
        ```sh
        npx prisma migrate dev
        ```

### 프로젝트 실행 (Running the Project)

```sh
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인하세요.

## 프로젝트 구조 (Project Structure)

FSD 아키텍처와 Next.js App Router를 적용함에 따라, 프로젝트의 주요 디렉토리 구조는 다음과 같이 구성될 수 있습니다:

```
.
├── app/                   # Next.js App Router (라우팅, 최상위 레이아웃, page.tsx 파일 등)
│   ├── (main)/            # 예시: 메인 애플리케이션 라우트 그룹
│   │   ├── dashboard/
│   │   │   └── page.tsx   # src/views/DashboardView.tsx 등을 사용하는 Next.js 페이지
│   │   └── layout.tsx     # 메인 레이아웃
│   └── global.css         # Next.js App Router 전역 스타일 (또는 src/app/styles로 이동)
├── prisma/                # Prisma 스키마 및 마이그레이션
├── public/                # 정적 에셋
├── src/
│   ├── app/               # FSD 애플리케이션 레이어 (전역 프로바이더, 초기 설정, 전역 스타일)
│   ├── views/             # FSD 뷰 레이어 (페이지 레벨 UI 컴포지션)
│   ├── widgets/           # FSD 위젯 레이어 (복합 UI 블록)
│   ├── features/          # FSD 기능 레이어 (사용자 스토리 관련 기능)
│   ├── entities/          # FSD 엔티티 레이어 (핵심 비즈니스 엔티티)
│   └── shared/            # FSD 공유 레이어 (공통 UI, 라이브러리, 훅, API 설정)
├── .env.example           # 환경 변수 예시
├── .eslintrc.json         # ESLint 설정
├── .gitignore             # Git 무시 파일 및 폴더
├── next.config.js         # Next.js 설정
├── package.json           # 프로젝트 의존성 및 스크립트
├── postcss.config.js      # PostCSS 설정
├── README.md              # 이 파일 (한국어)
├── tailwind.config.js     # Tailwind CSS 설정
└── tsconfig.json          # TypeScript 설정
```
*참고: Next.js의 루트 `app/` 디렉토리 내의 `page.tsx` 파일들은 `src/views/`에 정의된 뷰 컴포넌트들을 가져와 사용함으로써 페이지를 구성합니다. 기존 `src/components`, `src/lib`, `src/types`와 같은 일반적인 디렉토리는 FSD의 `shared`, `entities`, `features` 등의 하위 모듈로 분산되거나 해당 레이어의 컨벤션에 맞게 재구성됩니다.*

## 사용 가능한 스크립트 (Available Scripts)

프로젝트 디렉토리에서 다음 스크립트를 실행할 수 있습니다:

*   `npm run dev` 또는 `yarn dev`: 개발 모드로 앱을 실행합니다.
*   `npm run build` 또는 `yarn build`: 프로덕션용으로 앱을 빌드합니다.
*   `npm run start` 또는 `yarn start`: 프로덕션 서버를 시작합니다.
*   `npm run lint` 또는 `yarn lint`: ESLint를 사용하여 코드베이스를 검사합니다.
*   `npm run generate-types`: OpenAPI 명세로부터 API 타입을 생성합니다. (출력: `src/shared/api/openapi-types.ts`)
*   `npx prisma migrate dev`: Prisma 마이그레이션을 실행하여 데이터베이스 스키마를 업데이트합니다.
*   `npx prisma studio`: Prisma Studio를 열어 데이터베이스를 보고 관리합니다.

## 개인 프로젝트 노트 (Personal Project Note)

이 프로젝트는 학습 및 포트폴리오 목적으로 진행되는 개인 프로젝트입니다. Feature-Sliced Design 아키텍처와 다양한 기술 스택을 적용하여 실제 서비스 수준의 애플리케이션 개발 경험을 쌓는 것을 목표로 하고 있습니다. 따라서 일부 기능이나 구현 방식은 학습 과정에서의 실험적인 시도를 포함할 수 있습니다.

## 기여하기 (Contributing)

개인 프로젝트이지만, 학습 목적의 코드 리뷰나 개선 제안 등은 언제나 환영합니다.

1.  프로젝트 포크하기
2.  기능 브랜치 생성하기 (`git checkout -b feature/AmazingFeature`)
3.  변경 사항 커밋하기 (`git commit -m 'Add some AmazingFeature'`)
4.  브랜치에 푸시하기 (`git push origin feature/AmazingFeature`)
5.  풀 리퀘스트 열기

## 라이선스 (License)

MIT 라이선스에 따라 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.
