import { type NextRequest, NextResponse } from 'next/server';
import { READ_API_CACHE_HEADERS } from '@/shared/lib/api-cache-headers';
import prisma from '@/shared/lib/db';
import { createSlug } from '@/shared/utils/create-slug';

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: 게시물 목록 조회
 *     description: 검색어와 페이지네이션 옵션을 이용해 게시물 목록을 가져옵니다.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 게시물 검색어 (title, content, tag name)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 카테고리 slug로 필터링
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: 태그 ID 또는 이름을 쉼표로 구분하여 필터링
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: 한 페이지 당 아이템 개수
 *     responses:
 *       200:
 *         description: 게시물 목록과 메타데이터 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       category:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           slug:
 *                             type: string
 *                       author:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                 meta:
 *                   type: object
 *                   properties:
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage: { type: integer }
 *                         totalPages: { type: integer }
 *                         totalItems: { type: integer }
 *                         itemsPerPage: { type: integer }
 *                         hasNextPage: { type: boolean }
 *                         hasPrevPage: { type: boolean }
 *       400:
 *         description: 잘못된 페이지네이션 파라미터
 *       500:
 *         description: 서버 에러
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') ?? '';
    const category = searchParams.get('category') ?? '';
    const tags = searchParams.get('tags') ?? '';
    const page = Number.parseInt(searchParams.get('page') ?? '1', 10);
    const limit = Number.parseInt(searchParams.get('limit') ?? '10', 10);

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    const whereClause: any = {};

    // 검색어 필터링 (제목·본문·태그명)
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { some: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    // 카테고리 필터링
    if (category) {
      whereClause.category = {
        slug: category,
      };
    }

    // 태그 필터링 (숫자 ID 또는 이름)
    if (tags) {
      const tagTokens = tags
        .split(',')
        .map((token) => token.trim())
        .filter(Boolean);

      if (tagTokens.length > 0) {
        const tagIds: number[] = [];
        const tagNames: string[] = [];

        for (const token of tagTokens) {
          if (/^\d+$/.test(token)) {
            tagIds.push(Number(token));
          } else {
            tagNames.push(token);
          }
        }

        const tagConditions = [];
        if (tagIds.length > 0) {
          tagConditions.push({ id: { in: tagIds } });
        }
        if (tagNames.length > 0) {
          tagConditions.push({ name: { in: tagNames, mode: 'insensitive' as const } });
        }

        if (tagConditions.length > 0) {
          whereClause.tags = {
            some: tagConditions.length === 1 ? tagConditions[0] : { OR: tagConditions },
          };
        }
      }
    }

    const totalItems = await prisma.post.count({ where: whereClause });

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
        tags: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json(
      {
        data: posts,
        meta: {
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            itemsPerPage: limit,
            hasNextPage: page < Math.ceil(totalItems / limit),
            hasPrevPage: page > 1,
          },
        },
      },
      { headers: READ_API_CACHE_HEADERS },
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: 게시물 생성
 *     description: 새로운 게시물을 생성합니다. 관리자 또는 인증된 사용자만 접근 가능합니다.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시물 제목
 *               content:
 *                 type: string
 *                 description: 게시물 내용
 *               categoryId:
 *                 type: integer
 *                 description: 카테고리 ID
 *               tags:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 태그 ID 배열 (선택사항)
 *     responses:
 *       201:
 *         description: 게시물이 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 authorId:
 *                   type: integer
 *                 categoryId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: 인증되지 않은 사용자
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authorId = Number.parseInt(body.authorId);
    const categoryId = Number.parseInt(body.categoryId);

    // 필수 필드 유효성 검사
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'Title is required and must be a string' }, { status: 400 });
    }

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'Content is required and must be a string' }, { status: 400 });
    }

    if (!authorId || typeof authorId !== 'number') {
      return NextResponse.json({ error: 'Author ID is required and must be a number' }, { status: 400 });
    }

    if (!categoryId || typeof categoryId !== 'number') {
      return NextResponse.json({ error: 'Category ID is required and must be a number' }, { status: 400 });
    }

    // slug 자동 생성 및 중복 방지
    const slug = createSlug(body.title);
    let uniqueSlug = slug;
    let count = 1;
    while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${count++}`;
    }

    const newPost = await prisma.post.create({
      data: {
        title: body.title,
        slug: uniqueSlug,
        content: body.content,
        authorId,
        categoryId,
        tags: body.tags
          ? {
              connect: body.tags.map((tagId: number) => ({ id: tagId })),
            }
          : undefined,
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
