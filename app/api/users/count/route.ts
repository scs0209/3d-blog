import { NextResponse } from 'next/server';
import { getUserCount } from '@/features/user/api/user-api';

/**
 * @swagger
 * /api/users/count:
 *   get:
 *     summary: 전체 사용자 수 조회
 *     description: 전체 사용자 수를 반환합니다.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: 사용자 수 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       500:
 *         description: 서버 에러
 */
export async function GET() {
  try {
    const userCount = await getUserCount();
    return NextResponse.json({ count: userCount });
  } catch (error) {
    console.error('Failed to get user count:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
