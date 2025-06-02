import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';

/**
 * @swagger
 * /api/posts/{slug}/view:
 *   post:
 *     summary: 게시글 조회수 증가
 *     description: 게시글 조회수를 증가시킵니다.
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 조회수 증가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 views:
 *                   type: number
 */
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const updated = await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
    return NextResponse.json({ ok: true, views: updated.views });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}
