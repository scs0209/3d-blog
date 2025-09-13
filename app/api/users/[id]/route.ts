import { NextResponse } from 'next/server';
import { getUserById } from '@/features/user/api/user-api';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 * schema:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *     name:
 *       type: string
 *     email:
 *       type: string
 *     role:
 *       type: string
 *       enum: ['USER', 'ADMIN']
 *     createdAt:
 *       type: string
 *       format: date-time
 *     updatedAt:
 *       type: string
 *       format: date-time
 *     deletedAt:
 *       type: string
 *       format: date-time
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: 특정 사용자 정보 조회
 *     description: ID를 사용하여 특정 사용자 정보를 반환합니다.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserById(Number(params.id));
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(`Failed to get user with id ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
