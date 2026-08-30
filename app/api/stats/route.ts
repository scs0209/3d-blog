import { NextResponse } from 'next/server';
import { getStats } from '@/features/admin/home/api/stats-api';
import { READ_API_CACHE_HEADERS } from '@/shared/lib/api-cache-headers';
import { withPrismaRetry } from '@/shared/lib/with-prisma-retry';

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: 사이트 통계 조회
 *     description: 게시물, 사용자, 댓글, 조회수, 방문자의 월별 통계를 조회합니다.
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: 통계 데이터 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: 전체 게시물 수
 *                     thisMonth:
 *                       type: integer
 *                       description: 이번달 게시물 수
 *                     lastMonth:
 *                       type: integer
 *                       description: 저번달 게시물 수
 *                 users:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: 전체 사용자 수
 *                     thisMonth:
 *                       type: integer
 *                       description: 이번달 가입자 수
 *                     lastMonth:
 *                       type: integer
 *                       description: 저번달 가입자 수
 *                 comments:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: 전체 댓글 수
 *                     thisMonth:
 *                       type: integer
 *                       description: 이번달 댓글 수
 *                     lastMonth:
 *                       type: integer
 *                       description: 저번달 댓글 수
 *                 views:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: 전체 조회수
 *                     thisMonth:
 *                       type: integer
 *                       description: 이번달 조회수
 *                     lastMonth:
 *                       type: integer
 *                       description: 저번달 조회수
 *                 visitors:
 *                   type: object
 *                   properties:
 *                     today:
 *                       type: integer
 *                       description: 오늘 순방문자 수
 *                     total:
 *                       type: integer
 *                       description: 전체 순방문자 수
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch stats"
 */
export async function GET() {
  try {
    const stats = await withPrismaRetry(() => getStats());
    return NextResponse.json(stats, { headers: READ_API_CACHE_HEADERS });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
