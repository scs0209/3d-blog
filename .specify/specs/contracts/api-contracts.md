# API 계약 정의

## 🔗 엔드포인트 목록

### 대시보드 통계
```typescript
// GET /api/admin/dashboard
interface DashboardStatsRequest {
  period?: '7d' | '30d' | '90d' | '1y';
  startDate?: string;
  endDate?: string;
}

interface DashboardStatsResponse {
  success: boolean;
  data: {
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
  };
  message?: string;
}
```

### 포스트 관리
```typescript
// GET /api/admin/posts
interface PostsRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  tag?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

interface PostsResponse {
  success: boolean;
  data: PostTableData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
}

// PUT /api/admin/posts/[id]
interface UpdatePostRequest {
  title?: string;
  content?: string;
  status?: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  categoryId?: string;
  tagIds?: string[];
  adminNotes?: string;
}

interface UpdatePostResponse {
  success: boolean;
  data: PostTableData;
  message?: string;
}

// DELETE /api/admin/posts/[id]
interface DeletePostResponse {
  success: boolean;
  message: string;
}
```

### 댓글 관리
```typescript
// GET /api/admin/comments
interface CommentsRequest {
  page?: number;
  limit?: number;
  search?: string;
  isApproved?: boolean;
  isSpam?: boolean;
  postId?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'content' | 'reportedCount';
  sortOrder?: 'asc' | 'desc';
}

interface CommentsResponse {
  success: boolean;
  data: CommentTableData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
}

// PUT /api/admin/comments/[id]
interface UpdateCommentRequest {
  isApproved?: boolean;
  isSpam?: boolean;
  adminNotes?: string;
}

interface UpdateCommentResponse {
  success: boolean;
  data: CommentTableData;
  message?: string;
}

// POST /api/admin/comments/bulk
interface BulkCommentRequest {
  commentIds: string[];
  action: 'approve' | 'reject' | 'spam' | 'delete';
}

interface BulkCommentResponse {
  success: boolean;
  data: {
    processed: number;
    failed: number;
    errors: string[];
  };
  message?: string;
}
```

### 사용자 관리
```typescript
// GET /api/admin/users
interface UsersRequest {
  page?: number;
  limit?: number;
  search?: string;
  isAdmin?: boolean;
  status?: 'active' | 'inactive' | 'banned';
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'lastLoginAt' | 'name' | 'email';
  sortOrder?: 'asc' | 'desc';
}

interface UsersResponse {
  success: boolean;
  data: UserTableData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
}

// PUT /api/admin/users/[id]
interface UpdateUserRequest {
  name?: string;
  email?: string;
  isAdmin?: boolean;
  status?: 'active' | 'inactive' | 'banned';
}

interface UpdateUserResponse {
  success: boolean;
  data: UserTableData;
  message?: string;
}
```

### 활동 로그
```typescript
// GET /api/admin/activity
interface ActivityRequest {
  page?: number;
  limit?: number;
  userId?: string;
  action?: AdminAction;
  target?: AdminTarget;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface ActivityResponse {
  success: boolean;
  data: AdminActivity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
}
```

### 알림 관리
```typescript
// GET /api/admin/notifications
interface NotificationsRequest {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: 'info' | 'warning' | 'error' | 'success';
  dateFrom?: string;
  dateTo?: string;
}

interface NotificationsResponse {
  success: boolean;
  data: AdminNotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  unreadCount: number;
  message?: string;
}

// PUT /api/admin/notifications/[id]
interface UpdateNotificationRequest {
  isRead: boolean;
}

interface UpdateNotificationResponse {
  success: boolean;
  data: AdminNotification;
  message?: string;
}

// PUT /api/admin/notifications/read-all
interface ReadAllNotificationsResponse {
  success: boolean;
  data: {
    updatedCount: number;
  };
  message?: string;
}
```

## 🔒 인증 및 권한

### 인증 헤더
```typescript
interface AuthHeaders {
  'Authorization': string; // 'Bearer <token>'
  'Content-Type': 'application/json';
}
```

### 권한 검증
```typescript
interface PermissionCheck {
  requiredRole: 'admin';
  requiredPermissions?: string[];
}

// 모든 관리자 API는 다음 권한이 필요:
// - 사용자가 인증되어 있어야 함
// - 사용자가 관리자 권한을 가져야 함
// - 세션이 유효해야 함
```

## 📊 에러 처리

### 에러 응답 형식
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
  path: string;
}
```

### 에러 코드 정의
```typescript
enum ErrorCode {
  // 인증 에러
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // 검증 에러
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // 리소스 에러
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  
  // 서버 에러
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
}
```

### HTTP 상태 코드 매핑
```typescript
const HTTP_STATUS_MAP = {
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.SESSION_EXPIRED]: 401,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.INVALID_INPUT]: 400,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.CONFLICT]: 409,
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.DATABASE_ERROR]: 500,
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 502
};
```

## 🔄 실시간 업데이트

### WebSocket 이벤트
```typescript
interface WebSocketEvents {
  // 통계 업데이트
  'stats:updated': {
    type: 'stats:updated';
    data: Partial<DashboardStats>;
  };
  
  // 새로운 활동
  'activity:new': {
    type: 'activity:new';
    data: AdminActivity;
  };
  
  // 새로운 알림
  'notification:new': {
    type: 'notification:new';
    data: AdminNotification;
  };
  
  // 포스트 상태 변경
  'post:status-changed': {
    type: 'post:status-changed';
    data: {
      postId: string;
      status: PostStatus;
      updatedBy: string;
    };
  };
  
  // 댓글 상태 변경
  'comment:status-changed': {
    type: 'comment:status-changed';
    data: {
      commentId: string;
      isApproved: boolean;
      updatedBy: string;
    };
  };
}
```

### Server-Sent Events (SSE)
```typescript
// GET /api/admin/events
interface SSEConnection {
  headers: {
    'Cache-Control': 'no-cache';
    'Connection': 'keep-alive';
    'Content-Type': 'text/event-stream';
  };
  events: WebSocketEvents;
}
```

## 📈 성능 요구사항

### 응답 시간 목표
- **통계 조회**: < 500ms
- **목록 조회**: < 1s
- **단일 항목 조회**: < 200ms
- **업데이트 작업**: < 1s
- **대량 작업**: < 5s

### 캐싱 전략
```typescript
interface CacheConfig {
  'dashboard:stats': {
    ttl: 300; // 5분
    key: 'admin:dashboard:stats';
  };
  'posts:list': {
    ttl: 60; // 1분
    key: 'admin:posts:list:{query}';
  };
  'comments:list': {
    ttl: 30; // 30초
    key: 'admin:comments:list:{query}';
  };
  'users:list': {
    ttl: 600; // 10분
    key: 'admin:users:list:{query}';
  };
}
```

### Rate Limiting
```typescript
interface RateLimitConfig {
  'admin:api': {
    windowMs: 15 * 60 * 1000; // 15분
    max: 1000; // 최대 1000 요청
  };
  'admin:dashboard': {
    windowMs: 60 * 1000; // 1분
    max: 60; // 최대 60 요청
  };
  'admin:bulk': {
    windowMs: 60 * 1000; // 1분
    max: 10; // 최대 10 요청
  };
}
