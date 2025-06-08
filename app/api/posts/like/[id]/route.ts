import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';

/**
 * @swagger
 * /api/posts/like/{id}:
 *   get:
 *     summary: 포스트 좋아요 수 조회
 *     description: 특정 포스트의 좋아요 수와 사용자의 좋아요 여부를 반환합니다.
 *     tags:
 *       - Posts
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 포스트 ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: 사용자 ID (좋아요 여부 확인용)
 *     responses:
 *       200:
 *         description: 좋아요 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 isLiked:
 *                   type: boolean
 *       404:
 *         description: 포스트를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const postId = Number.parseInt(params.id);
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    // 포스트 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // 좋아요 수 조회
    const likeCount = await prisma.like.count({
      where: { postId },
    });

    // 사용자의 좋아요 여부 확인
    let isLiked = false;
    if (userId) {
      const userLike = await prisma.like.findFirst({
        where: {
          postId,
          userId: Number.parseInt(userId),
        },
      });
      isLiked = !!userLike;
    }

    return NextResponse.json({
      count: likeCount,
      isLiked,
    });
  } catch (error) {
    console.error('포스트 좋아요 조회 실패:', error);
    return NextResponse.json({ error: 'Failed to fetch post likes' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/posts/like/{id}:
 *   post:
 *     summary: 포스트 좋아요 토글
 *     description: 포스트에 좋아요를 추가하거나 제거합니다.
 *     tags:
 *       - Posts
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 포스트 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 좋아요 토글 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isLiked:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 포스트를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const postId = Number.parseInt(params.id);
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // 포스트 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // 기존 좋아요 확인
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId: Number.parseInt(userId),
      },
    });

    let isLiked: boolean;

    if (existingLike) {
      // 좋아요 제거
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      isLiked = false;
    } else {
      // 좋아요 추가
      await prisma.like.create({
        data: {
          postId,
          userId: Number.parseInt(userId),
        },
      });
      isLiked = true;
    }

    // 업데이트된 좋아요 수 조회
    const likeCount = await prisma.like.count({
      where: { postId },
    });

    return NextResponse.json({
      isLiked,
      count: likeCount,
    });
  } catch (error) {
    console.error('포스트 좋아요 토글 실패:', error);
    return NextResponse.json({ error: 'Failed to toggle post like' }, { status: 500 });
  }
}
