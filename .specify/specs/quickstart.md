# 블로그 어드민 대시보드 빠른 시작 가이드

## 🚀 개발 환경 설정

### 필수 요구사항
- **Node.js**: 18.17.0 이상
- **pnpm**: 8.0.0 이상 (권장)
- **PostgreSQL**: 14.0 이상
- **Git**: 2.30.0 이상

### 1. 저장소 클론 및 의존성 설치
```bash
# 저장소 클론
git clone <repository-url>
cd 3d-blog

# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local
```

### 2. 환경 변수 설정
```bash
# .env.local 파일에 다음 변수들 설정
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 데이터베이스 설정
```bash
# Prisma 마이그레이션 실행
pnpm prisma migrate dev

# 데이터베이스 시드 (선택사항)
pnpm prisma db seed
```

### 4. 개발 서버 실행
```bash
# 개발 서버 시작
pnpm dev

# 브라우저에서 http://localhost:3000 접속
```

## 🏗️ 프로젝트 구조

### FSD 아키텍처
```
src/
├── entities/           # 도메인 엔티티
│   ├── admin/         # 관리자 관련 엔티티
│   ├── post/          # 포스트 엔티티
│   ├── comment/       # 댓글 엔티티
│   └── user/          # 사용자 엔티티
├── features/          # 기능별 모듈
│   └── admin/         # 관리자 기능
│       ├── api/       # API 함수
│       ├── ui/        # UI 컴포넌트
│       └── model/     # 비즈니스 로직
├── widgets/           # 복합 UI 위젯
│   └── admin/         # 관리자 위젯
├── shared/            # 공용 코드
│   ├── ui/            # 공용 UI 컴포넌트
│   ├── api/           # API 유틸리티
│   └── lib/           # 공용 라이브러리
└── views/             # 페이지 뷰
    └── admin/         # 관리자 페이지
```

### 주요 디렉토리 설명
- **entities/**: 비즈니스 도메인 모델과 타입 정의
- **features/**: 사용자 시나리오별 기능 구현
- **widgets/**: 페이지 블록 단위의 복합 컴포넌트
- **shared/**: 프로젝트 전반에서 재사용되는 코드
- **views/**: 페이지별 뷰 컴포넌트

## 🔧 핵심 기술 스택

### Next.js 15 App Router
```typescript
// app/(protect)/admin/page.tsx
import { AdminDashboard } from '@/widgets/admin/ui/AdminDashboard';

export default function AdminPage() {
  return <AdminDashboard />;
}
```

### TanStack React Query
```typescript
// src/features/admin/api/dashboard.ts
import { useQuery } from '@tanstack/react-query';

export const useDashboardStats = (period?: string) => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats', period],
    queryFn: () => fetchDashboardStats(period),
    staleTime: 5 * 60 * 1000, // 5분
  });
};
```

### TanStack React Table
```typescript
// src/widgets/admin/ui/PostsTable.tsx
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

export const PostsTable = () => {
  const table = useReactTable({
    data: posts,
    columns: postColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id}>
                {header.column.columnDef.header}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map(row => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map(cell => (
              <TableCell key={cell.id}>
                {cell.getValue()}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

### React Three Fiber
```typescript
// src/widgets/admin/ui/Admin3DScene.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export const Admin3DScene = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CyberpunkBackground />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};
```

## 📊 데이터베이스 스키마

### 관리자 통계 테이블
```sql
-- 관리자 통계
CREATE TABLE admin_stats (
  id TEXT PRIMARY KEY,
  date TIMESTAMP UNIQUE NOT NULL,
  posts INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  users INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 관리자 활동 로그
CREATE TABLE admin_activities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  target_id TEXT,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 관리자 알림
CREATE TABLE admin_notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🎨 UI 컴포넌트 사용법

### Shadcn UI 컴포넌트
```typescript
import { Button } from '@/shadcn-ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn-ui/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn-ui/components/ui/table';

export const StatsCard = ({ title, value, icon }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
```

### 3D 컴포넌트
```typescript
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export const CyberpunkCube = () => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#00ff88" />
    </mesh>
  );
};
```

## 🔐 인증 및 권한

### 관리자 권한 검증
```typescript
// src/features/admin/api/auth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const requireAdmin = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.isAdmin) {
    throw new Error('관리자 권한이 필요합니다.');
  }
  
  return session;
};
```

### 미들웨어 설정
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // 관리자 페이지 접근 제어
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.isAdmin === true;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*']
};
```

## 🧪 테스트 실행

### 단위 테스트
```bash
# 모든 테스트 실행
pnpm test

# 특정 파일 테스트
pnpm test AdminDashboard.test.tsx

# 커버리지 리포트
pnpm test:coverage
```

### E2E 테스트
```bash
# Playwright 테스트 실행
pnpm test:e2e

# 특정 테스트 실행
pnpm test:e2e admin-dashboard.spec.ts
```

### 타입 체크
```bash
# TypeScript 타입 체크
pnpm type-check

# 빌드 테스트
pnpm build
```

## 🚀 배포

### 프로덕션 빌드
```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

### 환경 변수 설정
```bash
# 프로덕션 환경 변수
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

### 데이터베이스 마이그레이션
```bash
# 프로덕션 마이그레이션
pnpm prisma migrate deploy

# 데이터베이스 시드
pnpm prisma db seed
```

## 📚 추가 리소스

### 문서
- [Next.js 15 문서](https://nextjs.org/docs)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [TanStack Table 문서](https://tanstack.com/table/latest)
- [React Three Fiber 문서](https://docs.pmnd.rs/react-three-fiber)
- [Shadcn UI 문서](https://ui.shadcn.com)

### 유용한 명령어
```bash
# Prisma 스튜디오 실행
pnpm prisma studio

# 데이터베이스 리셋
pnpm prisma migrate reset

# 타입 생성
pnpm prisma generate

# 린트 및 포맷
pnpm lint
pnpm format
```
