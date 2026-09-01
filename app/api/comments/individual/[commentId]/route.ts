import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';
import { auth } from '@/shared/utils/auth';

/**
 * @swagger
 * /api/comments/individual/{commentId}:
 *   delete:
 *     summary: 댓글 삭제
 *     description: 특정 댓글을 삭제합니다. 대댓글이 있는 댓글을 삭제하면 대댓글도 함께 삭제됩니다. 작성자 또는 관리자만 삭제할 수 있습니다.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 댓글 ID
 *     responses:
 *       200:
 *         description: 댓글 삭제 성공
 *       401:
 *         description: 인증되지 않은 사용자
 *       403:
 *         description: 권한 없음 (작성자가 아님)
 *       404:
 *         description: 댓글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ commentId: string }> }) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId } = await params;
    const commentIdNum = Number(commentId);

    if (Number.isNaN(commentIdNum) || commentIdNum <= 0) {
      return NextResponse.json({ error: 'Invalid commentId' }, { status: 400 });
    }

    // 댓글 존재 확인 및 작성자 검증
    const comment = await prisma.comment.findUnique({
      where: { id: commentIdNum },
      include: {
        replies: true,
      },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // 작성자 또는 관리자만 삭제 가능
    if (comment.authorId !== Number.parseInt(session.user.id) && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own comments' }, { status: 403 });
    }

    const replyIds = comment.replies.map((reply) => reply.id);
    const commentIdsToDelete = [commentIdNum, ...replyIds];

    await prisma.$transaction([
      prisma.commentLike.deleteMany({
        where: { commentId: { in: commentIdsToDelete } },
      }),
      ...(replyIds.length > 0
        ? [
            prisma.comment.deleteMany({
              where: { parentId: commentIdNum },
            }),
          ]
        : []),
      prisma.comment.delete({
        where: { id: commentIdNum },
      }),
    ]);

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/comments/individual/{commentId}:
 *   put:
 *     summary: 댓글 수정
 *     description: 특정 댓글의 내용을 수정합니다. 작성자 또는 관리자만 수정할 수 있습니다.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: commentId
 *         in: path
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정할 댓글 내용
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않은 사용자
 *       403:
 *         description: 권한 없음 (작성자가 아님)
 *       404:
 *         description: 댓글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function PUT(req: Request, { params }: { params: Promise<{ commentId: string }> }) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId } = await params;
    const { content } = await req.json();
    const commentIdNum = Number(commentId);

    if (Number.isNaN(commentIdNum) || commentIdNum <= 0) {
      return NextResponse.json({ error: 'Invalid commentId' }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // 댓글 존재 확인 및 작성자 검증
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentIdNum },
    });

    if (!existingComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // 작성자 또는 관리자만 수정 가능
    if (existingComment.authorId !== Number.parseInt(session.user.id) && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own comments' }, { status: 403 });
    }

    // 댓글 수정
    const updatedComment = await prisma.comment.update({
      where: { id: commentIdNum },
      data: { content },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Failed to update comment:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}
