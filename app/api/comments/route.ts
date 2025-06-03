import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';
import { auth } from '@/shared/utils/auth';

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: 댓글 또는 대댓글 생성
 *     description: 새로운 댓글을 생성합니다. parentId가 있으면 대댓글, 없으면 댓글입니다. 인증된 사용자만 사용 가능합니다.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - postId
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *               postId:
 *                 type: integer
 *                 description: 게시물 ID
 *               parentId:
 *                 type: integer
 *                 description: 부모 댓글 ID (대댓글인 경우)
 *     responses:
 *       201:
 *         description: 댓글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 author:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 에러
 */
export async function POST(req: Request) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, postId, parentId } = await req.json();

    // 필수 필드 검증
    if (!content || !postId) {
      return NextResponse.json({ error: 'content and postId are required' }, { status: 400 });
    }

    // 게시물 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // 대댓글인 경우 부모 댓글 존재 확인
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
      }
    }

    // 댓글 생성 (authorId는 세션에서 가져옴)
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: Number.parseInt(session.user.id),
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Failed to create comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
