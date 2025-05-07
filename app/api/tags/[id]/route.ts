import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';

/**
 * @swagger
 * /api/tags/{id}:
 *   get:
 *     summary: Get a specific tag
 *     description: Retrieve a tag by its ID with related posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag retrieved successfully
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tagId = parseInt(id);
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      include: {
        posts: true,
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/tags/{id}:
 *   put:
 *     summary: Update a tag
 *     description: Update a tag's name by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tag ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       404:
 *         description: Tag not found
 *       400:
 *         description: Name already in use
 *       500:
 *         description: Server error
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tagId = parseInt(id);
    const { name } = await req.json();

    const existingTag = await prisma.tag.findUnique({
      where: { name },
    });

    if (existingTag && existingTag.id !== tagId) {
      return NextResponse.json({ error: 'Tag name already in use' }, { status: 400 });
    }

    const tag = await prisma.tag.update({
      where: { id: tagId },
      data: { name },
    });

    return NextResponse.json(tag);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     summary: Delete a tag
 *     description: Delete a tag by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tagId = parseInt(id);
    await prisma.tag.delete({
      where: { id: tagId },
    });

    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
