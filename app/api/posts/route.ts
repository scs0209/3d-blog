import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';

/**
 * @swagger
 * /api/posts:
 *   get:
 *     description: Retrieve all posts
 *     responses:
 *       200:
 *         description: 게시물 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
export async function GET() {
  const posts = await prisma.post.findMany();
  return NextResponse.json(posts, { status: 200 });
}

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: 게시물 생성
 *     description: 새로운 게시물을 생성합니다. 관리자 또는 인증된 사용자만 접근 가능합니다.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시물 제목
 *               content:
 *                 type: string
 *                 description: 게시물 내용
 *               categoryId:
 *                 type: integer
 *                 description: 카테고리 ID
 *               tags:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 태그 ID 배열 (선택사항)
 *     responses:
 *       201:
 *         description: 게시물이 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 authorId:
 *                   type: integer
 *                 categoryId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: 인증되지 않은 사용자
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authorId = parseInt(body.authorId);
    const categoryId = parseInt(body.categoryId);

    // 필수 필드 유효성 검사
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'Title is required and must be a string' }, { status: 400 });
    }

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'Content is required and must be a string' }, { status: 400 });
    }

    if (!authorId || typeof authorId !== 'number') {
      return NextResponse.json({ error: 'Author ID is required and must be a number' }, { status: 400 });
    }

    if (!categoryId || typeof categoryId !== 'number') {
      return NextResponse.json({ error: 'Category ID is required and must be a number' }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId,
        categoryId,
        tags: body.tags
          ? {
              connect: body.tags.map((tagId: number) => ({ id: tagId })),
            }
          : undefined,
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
