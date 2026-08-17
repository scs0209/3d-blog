// app/api/category/[slug]/route.ts
import { NextResponse } from 'next/server';
import { parseCategoryParentId } from '@/entities/category';
import prisma from '@/shared/lib/db';
import { createSlug } from '@/shared/utils/create-slug';
import { auth } from '@/shared/utils/auth';

/**
 * @swagger
 * /api/category/{slug}:
 *   get:
 *     summary: Get a single category with its posts
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword for post title or content
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Returns category with posts and pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 description:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 posts:
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
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                       _count:
 *                         type: object
 *                         properties:
 *                           comments:
 *                             type: integer
 *                           likes:
 *                             type: integer
 *                 _count:
 *                   type: object
 *                   properties:
 *                     posts:
 *                       type: integer
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug: rawSlug } = await params;
    let slug = rawSlug;
    for (let i = 0; i < 3; i++) {
      try {
        const decoded = decodeURIComponent(slug);
        if (decoded === slug) break;
        slug = decoded;
      } catch {
        break;
      }
    }
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');

    // 검색 조건 구성
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { content: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    const category = await prisma.category.findUnique({
      where: {
        slug: slug,
      },
      include: {
        posts: {
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // 검색된 포스트 개수 계산
    const totalPosts = search
      ? await prisma.post.count({
          where: {
            categoryId: category.id,
            ...whereClause,
          },
        })
      : category._count.posts;

    return NextResponse.json({
      ...category,
      pagination: {
        page,
        limit,
        total: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/categories/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/category/{slug}:
 *   patch:
 *     summary: Update a category
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
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
 *                 minLength: 1
 *               description:
 *                 type: string
 *                 nullable: true
 *               parentId:
 *                 type: integer
 *                 nullable: true
 *                 description: 부모 카테고리 ID (루트면 null)
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 description:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input or duplicate category name
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden: Admin access required"
 *       500:
 *         description: Internal server error
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, parentId } = body;
    const categoryId = Number.parseInt(slug);
    const shouldUpdateParentId = Object.hasOwn(body, 'parentId');

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const current = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!current) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    let normalizedParentId: number | null = null;
    if (shouldUpdateParentId) {
      if (parentId != null && parentId !== '') {
        const parsedParentId = parseCategoryParentId(parentId);
        if (parsedParentId == null) {
          return NextResponse.json({ error: 'Invalid parentId' }, { status: 400 });
        }
        if (parsedParentId === categoryId) {
          return NextResponse.json({ error: 'Category cannot be its own parent' }, { status: 400 });
        }

        const allCategories = await prisma.category.findMany({
          select: { id: true, parentId: true },
        });
        const blocked = new Set<number>([categoryId]);
        const childrenByParent = new Map<number, number[]>();
        for (const category of allCategories) {
          if (category.parentId == null) continue;
          const list = childrenByParent.get(category.parentId) ?? [];
          list.push(category.id);
          childrenByParent.set(category.parentId, list);
        }
        const stack = [categoryId];
        while (stack.length > 0) {
          const currentId = stack.pop();
          if (currentId == null) continue;
          for (const childId of childrenByParent.get(currentId) ?? []) {
            if (blocked.has(childId)) continue;
            blocked.add(childId);
            stack.push(childId);
          }
        }

        if (blocked.has(parsedParentId)) {
          return NextResponse.json({ error: 'Cannot set a descendant as parent' }, { status: 400 });
        }

        const parent = await prisma.category.findUnique({ where: { id: parsedParentId } });
        if (!parent) {
          return NextResponse.json({ error: 'Parent category not found' }, { status: 400 });
        }
        normalizedParentId = parsedParentId;
      } else {
        normalizedParentId = null;
      }
    }

    // Check for duplicate category name, excluding current category
    const existing = await prisma.category.findFirst({
      where: {
        name,
        NOT: {
          id: categoryId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: name.trim(),
        slug: createSlug(name),
        description: description?.trim(),
        ...(shouldUpdateParentId ? { parentId: normalizedParentId } : {}),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('PATCH /api/categories/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/category/{slug}:
 *   delete:
 *     summary: Delete a category
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Cannot delete category with posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cannot delete category that contains posts"
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const categoryId = Number.parseInt(slug);

    // Check if category has any posts
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            posts: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (category._count.posts > 0) {
      return NextResponse.json({ error: 'Cannot delete category that contains posts' }, { status: 400 });
    }

    if (category._count.children > 0) {
      return NextResponse.json({ error: 'Cannot delete category that has child categories' }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/categories/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
