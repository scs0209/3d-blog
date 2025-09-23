# Data Model: 블로그 어드민 대시보드

**Feature**: 블로그 어드민 대시보드  
**Date**: 2025-01-16  
**Status**: Complete

## 기존 Prisma 스키마 활용

기존 데이터베이스 스키마를 그대로 활용하되, 관리자 대시보드 전용 뷰 모델을 추가로 정의합니다.

### 핵심 엔티티

#### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  posts: Post[];
  comments: Comment[];
}
```

#### Post
```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  author: User;
  category: Category;
  comments: Comment[];
  tags: PostTag[];
}
```

#### Comment
```typescript
interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  post: Post;
  author: User;
}
```

#### Category
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  posts: Post[];
}
```

#### Tag
```typescript
interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  posts: PostTag[];
}
```

#### PostTag (다대다 관계)
```typescript
interface PostTag {
  postId: string;
  tagId: string;
  // Relations
  post: Post;
  tag: Tag;
}
```

## 관리자 대시보드 전용 뷰 모델

### DashboardStats
```typescript
interface DashboardStats {
  totalPosts: number;
  totalComments: number;
  totalUsers: number;
  totalViews: number;
  recentPosts: Post[];
  recentComments: Comment[];
  recentUsers: User[];
  chartData: ChartDataPoint[];
}

interface ChartDataPoint {
  date: string;
  posts: number;
  comments: number;
  users: number;
  views: number;
}
```

### AdminActivity
```typescript
interface AdminActivity {
  id: string;
  userId: string;
  action: string;
  target: string;
  metadata: Record<string, any>;
  createdAt: Date;
  // Relations
  user: User;
}
```

### PostManagementView
```typescript
interface PostManagementView {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
  published: boolean;
  commentCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### CommentManagementView
```typescript
interface CommentManagementView {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  post: {
    id: string;
    title: string;
  };
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### UserManagementView
```typescript
interface UserManagementView {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  postCount: number;
  commentCount: number;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 데이터 검증 규칙

### User 검증
- `email`: 유효한 이메일 형식, 고유값
- `name`: 1-50자, 필수
- `isAdmin`: boolean, 기본값 false

### Post 검증
- `title`: 1-200자, 필수
- `content`: 1-10000자, 필수
- `published`: boolean, 기본값 false
- `authorId`: 존재하는 User ID
- `categoryId`: 존재하는 Category ID

### Comment 검증
- `content`: 1-1000자, 필수
- `postId`: 존재하는 Post ID
- `authorId`: 존재하는 User ID
- `approved`: boolean, 기본값 false

### Category 검증
- `name`: 1-50자, 고유값, 필수
- `slug`: URL 안전한 형식, 고유값, 필수
- `description`: 0-200자, 선택

### Tag 검증
- `name`: 1-30자, 고유값, 필수
- `slug`: URL 안전한 형식, 고유값, 필수

## 상태 전환

### Post 상태 전환
```
Draft → Published (게시)
Published → Draft (비공개)
```

### Comment 상태 전환
```
Pending → Approved (승인)
Pending → Rejected (거부)
Approved → Rejected (승인 취소)
Rejected → Approved (재승인)
```

### User 상태 전환
```
Active → Suspended (정지)
Suspended → Active (활성화)
```

## 관계 제약사항

### 참조 무결성
- Post.authorId는 User.id를 참조
- Post.categoryId는 Category.id를 참조
- Comment.postId는 Post.id를 참조
- Comment.authorId는 User.id를 참조
- PostTag.postId는 Post.id를 참조
- PostTag.tagId는 Tag.id를 참조

### 삭제 정책
- User 삭제 시: 관련 Post, Comment는 CASCADE 또는 SET NULL
- Post 삭제 시: 관련 Comment는 CASCADE, PostTag는 CASCADE
- Category 삭제 시: 관련 Post는 SET NULL 또는 CASCADE
- Tag 삭제 시: 관련 PostTag는 CASCADE

## 인덱스 최적화

### 성능을 위한 인덱스
- `Post.published` (게시 상태 필터링)
- `Post.authorId` (작성자별 조회)
- `Post.categoryId` (카테고리별 조회)
- `Comment.approved` (승인 상태 필터링)
- `Comment.postId` (포스트별 댓글 조회)
- `User.isAdmin` (관리자 권한 확인)
- `Post.createdAt` (날짜별 정렬)
- `Comment.createdAt` (날짜별 정렬)

## 데이터 마이그레이션

기존 스키마를 활용하므로 추가 마이그레이션이 필요하지 않습니다. 필요시 다음 필드들을 추가할 수 있습니다:

- `User.lastLoginAt`: 마지막 로그인 시간
- `Post.viewCount`: 조회수
- `AdminActivity`: 관리자 활동 로그
