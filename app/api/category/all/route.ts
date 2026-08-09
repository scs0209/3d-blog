import { NextResponse } from 'next/server';
import { parseCategoryParentId } from '@/entities/category';
import prisma from '@/shared/lib/db';
import { auth } from '@/shared/utils/auth';
import { createSlug } from '@/shared/utils/create-slug';

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: 카테고리 고유 ID
 *         name:
 *           type: string
 *           description: 카테고리 이름
 *         description:
 *           type: string
 *           nullable: true
 *           description: 카테고리 설명
 *         slug:
 *           type: string
 *           description: 카테고리 슬러그
 *         parentId:
 *           type: integer
 *           nullable: true
 *           description: 부모 카테고리 ID (루트면 null)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 일시
 *         _count:
 *           type: object
 *           properties:
 *             posts:
 *               type: integer
 *               description: 해당 카테고리의 게시글 수
 *             children:
 *               type: integer
 *               description: 자식 카테고리 수
 */

/**
 * @swagger
 * /api/category/all:
 *   get:
 *     summary: 카테고리 목록 조회
 *     description: 모든 카테고리를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: includePostCount
 *         schema:
 *           type: boolean
 *         description: 각 카테고리의 게시글 수(_count.posts) 포함 여부. 자식 수(_count.children)는 항상 포함됩니다.
 *     responses:
 *       200:
 *         description: 카테고리 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: 서버 에러
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includePostCount = searchParams.get('includePostCount') === 'true';

    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            children: true,
            ...(includePostCount ? { posts: true } : {}),
          },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/category/all:
 *   post:
 *     summary: 새 카테고리 생성
 *     description: 새로운 카테고리를 생성합니다. (관리자 전용)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: 카테고리 이름
 *               description:
 *                 type: string
 *                 description: 카테고리 설명
 *               parentId:
 *                 type: integer
 *                 nullable: true
 *                 description: 부모 카테고리 ID (루트면 null)
 *     responses:
 *       200:
 *         description: 카테고리 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: 잘못된 요청 (중복된 이름 등)
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 에러
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { name, description, parentId } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    let normalizedParentId: number | null = null;
    if (parentId != null && parentId !== '') {
      const parsedParentId = parseCategoryParentId(parentId);
      if (parsedParentId == null) {
        return NextResponse.json({ error: 'Invalid parentId' }, { status: 400 });
      }

      const parent = await prisma.category.findUnique({ where: { id: parsedParentId } });
      if (!parent) {
        return NextResponse.json({ error: 'Parent category not found' }, { status: 400 });
      }
      normalizedParentId = parsedParentId;
    }

    // Check for duplicate category name
    const existing = await prisma.category.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: createSlug(name),
        description: description?.trim(),
        parentId: normalizedParentId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
