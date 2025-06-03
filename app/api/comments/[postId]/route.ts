import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';

/**
 * @swagger
 * /api/comments/{postId}:
 *   get:
 *     summary: 특정 게시물의 댓글 목록 조회
 *     description: 게시물 ID에 해당하는 모든 댓글과 대댓글을 계층 구조로 반환합니다.
 *     tags:
 *       - Comments
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시물 ID
 *     responses:
 *       200:
 *         description: 댓글 목록 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   author:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                   replies:
 *                     type: array
 *                     items:
 *                       type: object
 *       404:
 *         description: 게시물을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function GET(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params;
    const postIdNum = Number(postId);

    if (Number.isNaN(postIdNum) || postIdNum <= 0) {
      return NextResponse.json({ error: 'Invalid postId' }, { status: 400 });
    }

    // 게시물 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postIdNum },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // 댓글과 대댓글을 계층 구조로 조회
    const comments = await prisma.comment.findMany({
      where: {
        postId: postIdNum,
        parentId: null, // 최상위 댓글만 먼저 조회
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // 최신 댓글이 위로
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}
