import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';

/**
 * @swagger
 * /api/comments/like/{id}:
 *   get:
 *     summary: 댓글 좋아요/싫어요 수 조회
 *     description: 특정 댓글의 좋아요/싫어요 수와 사용자의 반응 상태를 반환합니다.
 *     tags:
 *       - Comments
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 댓글 ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: 사용자 ID (반응 상태 확인용)
 *     responses:
 *       200:
 *         description: 댓글 반응 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: integer
 *                 dislikes:
 *                   type: integer
 *                 userReaction:
 *                   type: string
 *                   enum: [LIKE, DISLIKE, null]
 *       404:
 *         description: 댓글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const commentId = Number.parseInt(id);
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    // 댓글 존재 확인
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // 좋아요 수 조회
    const likes = await prisma.commentLike.count({
      where: {
        commentId,
        type: 'LIKE',
      },
    });

    // 싫어요 수 조회
    const dislikes = await prisma.commentLike.count({
      where: {
        commentId,
        type: 'DISLIKE',
      },
    });

    // 사용자의 반응 확인
    let userReaction = null;
    if (userId) {
      const userLike = await prisma.commentLike.findFirst({
        where: {
          commentId,
          userId: Number.parseInt(userId),
        },
      });
      userReaction = userLike?.type || null;
    }

    return NextResponse.json({
      likes,
      dislikes,
      userReaction,
    });
  } catch (error) {
    console.error('댓글 좋아요 조회 실패:', error);
    return NextResponse.json({ error: 'Failed to fetch comment likes' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/comments/like/{id}:
 *   post:
 *     summary: 댓글 좋아요/싫어요 토글
 *     description: 댓글에 좋아요/싫어요를 추가하거나 제거합니다.
 *     tags:
 *       - Comments
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 댓글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - type
 *             properties:
 *               userId:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [LIKE, DISLIKE]
 *     responses:
 *       200:
 *         description: 댓글 반응 토글 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userReaction:
 *                   type: string
 *                   enum: [LIKE, DISLIKE, null]
 *                 likes:
 *                   type: integer
 *                 dislikes:
 *                   type: integer
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 댓글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const commentId = Number.parseInt(id);
    const { userId, type } = await req.json();

    if (!userId || !type || !['LIKE', 'DISLIKE'].includes(type)) {
      return NextResponse.json(
        {
          error: 'userId and type (LIKE or DISLIKE) are required',
        },
        { status: 400 },
      );
    }

    // 댓글 존재 확인
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // 기존 반응 확인
    const existingReaction = await prisma.commentLike.findFirst({
      where: {
        commentId,
        userId: Number.parseInt(userId),
      },
    });

    let userReaction = null;

    if (existingReaction) {
      if (existingReaction.type === type) {
        // 같은 반응이면 제거
        await prisma.commentLike.delete({
          where: { id: existingReaction.id },
        });
        userReaction = null;
      } else {
        // 다른 반응이면 업데이트
        await prisma.commentLike.update({
          where: { id: existingReaction.id },
          data: { type },
        });
        userReaction = type;
      }
    } else {
      // 새로운 반응 추가
      await prisma.commentLike.create({
        data: {
          commentId,
          userId: Number.parseInt(userId),
          type,
        },
      });
      userReaction = type;
    }

    // 업데이트된 좋아요/싫어요 수 조회
    const likes = await prisma.commentLike.count({
      where: {
        commentId,
        type: 'LIKE',
      },
    });

    const dislikes = await prisma.commentLike.count({
      where: {
        commentId,
        type: 'DISLIKE',
      },
    });

    return NextResponse.json({
      userReaction,
      likes,
      dislikes,
    });
  } catch (error) {
    console.error('댓글 좋아요 토글 실패:', error);
    return NextResponse.json({ error: 'Failed to toggle comment like' }, { status: 500 });
  }
}
