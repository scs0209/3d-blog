// app/api/categories/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';
import { createSlug } from '@/shared/utils/create-slug';
import { auth } from '@/shared/utils/auth';

// GET /api/categories/[id] - Get a single category with its posts
export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const category = await prisma.category.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        posts: {
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
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ...category,
      pagination: {
        page,
        limit,
        total: category._count.posts,
        totalPages: Math.ceil(category._count.posts / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/categories/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// PATCH /api/categories/[id] - Update a category
export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 },
      );
    }

    const { name, description } = await request.json();
    const categoryId = parseInt(params.slug);

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 },
      );
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
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 },
      );
    }

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: name.trim(),
        slug: createSlug(name),
        description: description?.trim(),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('PATCH /api/categories/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 },
      );
    }

    const categoryId = parseInt(params.slug);

    // Check if category has any posts
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 },
      );
    }

    if (category._count.posts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category that contains posts' },
        { status: 400 },
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/categories/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
