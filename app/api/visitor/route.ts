import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';

/**
 * @swagger
 * /api/visitor:
 *   get:
 *     summary: 오늘 방문자 수와 총 방문자 수 조회
 *     description: VisitorLog를 기반으로 오늘 방문자 수와 전체 방문자 수를 반환합니다.
 *     tags:
 *       - Visitor
 *     responses:
 *       200:
 *         description: 방문자 통계 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 today:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       500:
 *         description: 서버 에러
 */
export async function GET() {
  try {
    // ! 유틸 함수로 빼기
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 오늘 방문자 수 (ip 기준 유니크)
    const todayVisitors = await prisma.visitorLog.groupBy({
      by: ['ip'],
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });
    // 전체 방문자 수 (ip 기준 유니크)
    const totalVisitors = await prisma.visitorLog.groupBy({
      by: ['ip'],
    });
    return NextResponse.json({ today: todayVisitors.length, total: totalVisitors.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch visitor stats' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/visitor:
 *   post:
 *     summary: 방문자 기록 추가
 *     description: 방문자의 ip, userAgent, path를 VisitorLog에 기록합니다.
 *     tags:
 *       - Visitor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *     responses:
 *       201:
 *         description: 기록 성공
 *       500:
 *         description: 서버 에러
 */
export async function POST(req: Request) {
  try {
    const { path } = await req.json();
    // 실제 서비스에서는 IP 추출을 프록시 환경에 맞게 조정 필요
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || 'unknown';
    const userAgent = req.headers.get('user-agent') || '';
    await prisma.visitorLog.create({
      data: { ip, userAgent, path },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log visitor' }, { status: 500 });
  }
}
