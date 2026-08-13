import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';

const VISITOR_COOKIE = 'visitor_day';
const SEOUL_TZ = 'Asia/Seoul';

/** Asia/Seoul 기준 YYYY-MM-DD */
const getSeoulDateKey = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: SEOUL_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

/** 서울 자정까지 남은 초 (쿠키 Max-Age) */
const getSecondsUntilSeoulMidnight = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SEOUL_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const hours = get('hour');
  const minutes = get('minute');
  const seconds = get('second');
  return 24 * 60 * 60 - (hours * 3600 + minutes * 60 + seconds);
};

/**
 * @swagger
 * /api/visitor:
 *   get:
 *     summary: 오늘 방문자 수와 총 방문자 수 조회
 *     description: VisitorDaily 일별 집계를 합산해 오늘/전체 순방문자를 반환합니다.
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
    const todayKey = getSeoulDateKey();
    const [todayRow, aggregate] = await Promise.all([
      prisma.visitorDaily.findUnique({ where: { date: todayKey } }),
      prisma.visitorDaily.aggregate({ _sum: { count: true } }),
    ]);

    return NextResponse.json({
      today: todayRow?.count ?? 0,
      total: aggregate._sum.count ?? 0,
    });
  } catch (error) {
    console.error('Failed to fetch visitor stats:', error);
    return NextResponse.json({ error: 'Failed to fetch visitor stats' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/visitor:
 *   post:
 *     summary: 오늘 순방문자 카운트 (+1, 브라우저당 1회)
 *     description: visitor_day 쿠키로 당일 중복을 막고 VisitorDaily.count만 증가시킵니다. IP/UA/path는 저장하지 않습니다.
 *     tags:
 *       - Visitor
 *     responses:
 *       200:
 *         description: 이미 집계됨 또는 집계 성공
 *       500:
 *         description: 서버 에러
 */
export async function POST(req: NextRequest) {
  try {
    const todayKey = getSeoulDateKey();
    const alreadyCounted = req.cookies.get(VISITOR_COOKIE)?.value === todayKey;

    if (alreadyCounted) {
      return NextResponse.json({ ok: true, counted: false });
    }

    await prisma.visitorDaily.upsert({
      where: { date: todayKey },
      create: { date: todayKey, count: 1 },
      update: { count: { increment: 1 } },
    });

    const response = NextResponse.json({ ok: true, counted: true });
    response.cookies.set({
      name: VISITOR_COOKIE,
      value: todayKey,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: Math.max(getSecondsUntilSeoulMidnight(), 60),
    });

    return response;
  } catch (error) {
    console.error('Failed to log visitor:', error);
    return NextResponse.json({ error: 'Failed to log visitor' }, { status: 500 });
  }
}
