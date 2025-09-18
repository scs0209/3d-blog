# 데이터 모델 설계

## 📊 Prisma 스키마 확장

### 관리자 통계 테이블
```prisma
model AdminStats {
  id        String   @id @default(cuid())
  date      DateTime @unique
  posts     Int      @default(0)
  comments  Int      @default(0)
  users     Int      @default(0)
  views     Int      @default(0)
  likes     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("admin_stats")
}

model AdminActivity {
  id        String   @id @default(cuid())
  userId    String
  action    String   // 'create', 'update', 'delete', 'approve', 'reject'
  target    String   // 'post', 'comment', 'user', 'category', 'tag'
  targetId  String?
  metadata  Json?    // 추가 메타데이터
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("admin_activities")
  @@index([userId])
  @@index([action])
  @@index([createdAt])
}

model AdminNotification {
  id        String   @id @default(cuid())
  userId    String
  title     String
  message   String
  type      String   // 'info', 'warning', 'error', 'success'
  isRead    Boolean  @default(false)
  metadata  Json?
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("admin_notifications")
  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
}
```

### 기존 모델 확장
```prisma
model User {
  // ... 기존 필드들
  adminActivities AdminActivity[]
  adminNotifications AdminNotification[]
  isAdmin         Boolean @default(false)
  lastLoginAt     DateTime?
  loginCount      Int     @default(0)
}

model Post {
  // ... 기존 필드들
  adminNotes      String?  // 관리자 전용 메모
  isFeatured      Boolean  @default(false)
  viewCount       Int      @default(0)
  lastViewedAt    DateTime?
}

model Comment {
  // ... 기존 필드들
  isApproved      Boolean  @default(false)
  isSpam          Boolean  @default(false)
  adminNotes      String?  // 관리자 전용 메모
  reportedCount   Int      @default(0)
}
```

## 🔧 TypeScript 타입 정의

### 대시보드 통계 타입
```typescript
interface DashboardStats {
  totalPosts: number;
  totalComments: number;
  totalUsers: number;
  totalViews: number;
  totalLikes: number;
  todayPosts: number;
  todayComments: number;
  todayUsers: number;
  todayViews: number;
  recentActivity: AdminActivity[];
  chartData: ChartDataPoint[];
  topPosts: TopPost[];
  topUsers: TopUser[];
}

interface ChartDataPoint {
  date: string;
  posts: number;
  comments: number;
  users: number;
  views: number;
}

interface TopPost {
  id: string;
  title: string;
  slug: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  author: {
    name: string;
    email: string;
  };
}

interface TopUser {
  id: string;
  name: string;
  email: string;
  postCount: number;
  commentCount: number;
  lastLoginAt: Date | null;
}
```

### 관리자 활동 타입
```typescript
interface AdminActivity {
  id: string;
  userId: string;
  action: AdminAction;
  target: AdminTarget;
  targetId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

type AdminAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'approve' 
  | 'reject' 
  | 'feature' 
  | 'unfeature'
  | 'spam' 
  | 'unspam';

type AdminTarget = 
  | 'post' 
  | 'comment' 
  | 'user' 
  | 'category' 
  | 'tag' 
  | 'settings';
```

### 데이터 테이블 타입
```typescript
interface PostTableData {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    name: string;
    email: string;
  };
  category: {
    name: string;
    slug: string;
  };
  tags: Array<{
    name: string;
    slug: string;
  }>;
}

interface CommentTableData {
  id: string;
  content: string;
  isApproved: boolean;
  isSpam: boolean;
  reportedCount: number;
  createdAt: Date;
  author: {
    name: string;
    email: string;
  };
  post: {
    title: string;
    slug: string;
  };
}

interface UserTableData {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  postCount: number;
  commentCount: number;
  lastLoginAt: Date | null;
  createdAt: Date;
  status: UserStatus;
}

type PostStatus = 'draft' | 'published' | 'archived';
type UserStatus = 'active' | 'inactive' | 'banned';
```

### API 응답 타입
```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface DashboardStatsResponse extends ApiResponse<DashboardStats> {}
interface PostsResponse extends PaginatedResponse<PostTableData> {}
interface CommentsResponse extends PaginatedResponse<CommentTableData> {}
interface UsersResponse extends PaginatedResponse<UserTableData> {}
```

### 필터 및 정렬 타입
```typescript
interface TableFilters {
  search?: string;
  status?: string;
  category?: string;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
  author?: string;
}

interface TableSort {
  field: string;
  direction: 'asc' | 'desc';
}

interface TablePagination {
  page: number;
  limit: number;
}

interface TableQuery extends TableFilters, TableSort, TablePagination {}
```

## 🔄 데이터 플로우

### 통계 데이터 업데이트
1. **실시간 업데이트**: 새로운 포스트/댓글 생성 시 즉시 통계 업데이트
2. **일일 집계**: 매일 자정에 전날 통계 집계
3. **주간/월간 리포트**: 정기적으로 집계 데이터 생성

### 활동 로그 기록
1. **관리자 액션**: 모든 관리자 액션 자동 기록
2. **메타데이터 수집**: IP 주소, User Agent 등 수집
3. **보존 정책**: 6개월 후 자동 삭제 (설정 가능)

### 알림 시스템
1. **실시간 알림**: 새로운 댓글, 신고 등 즉시 알림
2. **일일 요약**: 하루 활동 요약 이메일
3. **중요 알림**: 시스템 오류, 보안 이슈 등

## 📈 성능 최적화

### 데이터베이스 인덱스
```sql
-- 통계 조회 최적화
CREATE INDEX idx_admin_stats_date ON admin_stats(date);

-- 활동 로그 조회 최적화
CREATE INDEX idx_admin_activities_user_id ON admin_activities(user_id);
CREATE INDEX idx_admin_activities_action ON admin_activities(action);
CREATE INDEX idx_admin_activities_created_at ON admin_activities(created_at);

-- 알림 조회 최적화
CREATE INDEX idx_admin_notifications_user_id ON admin_notifications(user_id);
CREATE INDEX idx_admin_notifications_is_read ON admin_notifications(is_read);
```

### 캐싱 전략
- **통계 데이터**: 5분 캐시 (Redis)
- **사용자 목록**: 10분 캐시
- **포스트 목록**: 1분 캐시
- **댓글 목록**: 30초 캐시

### 페이지네이션
- **기본 페이지 크기**: 20개
- **최대 페이지 크기**: 100개
- **커서 기반 페이지네이션**: 대용량 데이터용
