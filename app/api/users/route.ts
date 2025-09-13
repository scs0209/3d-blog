import { NextResponse } from 'next/server';
import { getUsers } from '@/features/user/api/user-api';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 모든 사용자 목록 조회
 *     description: 모든 사용자 목록을 반환합니다.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: 사용자 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: 서버 에러
 */
export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to get users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
