import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: 댓글 삭제
 *     description: 특정 댓글을 삭제합니다. 대댓글이 있는 댓글을 삭제하면 대댓글도 함께 삭제됩니다.
 *     tags:
 *       - Comments
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
 *       404:
 *         description: 댓글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ commentId: string }> }) {
  try {
    const { commentId } = await params;
    const commentIdNum = Number(commentId);

    if (Number.isNaN(commentIdNum) || commentIdNum <= 0) {
      return NextResponse.json({ error: 'Invalid commentId' }, { status: 400 });
    }

    // 댓글 존재 확인
    const comment = await prisma.comment.findUnique({
      where: { id: commentIdNum },
      include: {
        replies: true,
      },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // 대댓글이 있는 경우 먼저 대댓글들을 삭제
    if (comment.replies.length > 0) {
      await prisma.comment.deleteMany({
        where: { parentId: commentIdNum },
      });
    }

    // 댓글 삭제
    await prisma.comment.delete({
      where: { id: commentIdNum },
    });

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/comments/{commentId}:
 *   put:
 *     summary: 댓글 수정
 *     description: 특정 댓글의 내용을 수정합니다.
 *     tags:
 *       - Comments
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
 *       404:
 *         description: 댓글을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function PUT(req: Request, { params }: { params: Promise<{ commentId: string }> }) {
  try {
    const { commentId } = await params;
    const { content } = await req.json();
    const commentIdNum = Number(commentId);

    if (Number.isNaN(commentIdNum) || commentIdNum <= 0) {
      return NextResponse.json({ error: 'Invalid commentId' }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // 댓글 존재 확인
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentIdNum },
    });

    if (!existingComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
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
