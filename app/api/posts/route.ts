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
 *     description: 게시물 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully created
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 유효성 검사
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 },
      );
    }

    const newPost = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content || null, // content는 선택 사항
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 },
    );
  }
}
