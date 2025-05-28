import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';

/**
 * @swagger
 * /api/posts/{slug}:
 *   get:
 *     summary: 특정 게시물 조회
 *     description: 게시물 slug를 기반으로 상세 정보를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: 게시물 slug
 *     responses:
 *       200:
 *         description: 게시물 조회 성공
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
 *                 author:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 category:
 *                   type: object
 *                 tags:
 *                   type: array
 *                 comments:
 *                   type: array
 *                 likes:
 *                   type: array
 *       404:
 *         description: 게시물을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Invalid post slug' }, { status: 400 });
    }
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/posts/{slug}:
 *   put:
 *     summary: 게시물 수정
 *     description: 특정 게시물의 정보를 수정합니다.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: 게시물 slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *                 description: 태그 ID 배열
 *     responses:
 *       200:
 *         description: 게시물 수정 성공
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 게시물을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await req.json();
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Invalid post slug' }, { status: 400 });
    }
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    const updateData: any = {};
    if (body.title) {
      updateData.title = body.title;
    }
    if (body.content) {
      updateData.content = body.content;
    }
    if (body.categoryId) {
      updateData.categoryId = Number.parseInt(body.categoryId);
    }
    if (body.tags) {
      updateData.tags = {
        set: [],
        connect: body.tags.map((tagId: number) => ({ id: tagId })),
      };
    }
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: updateData,
      include: {
        author: true,
        category: true,
        tags: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });
    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/posts/{slug}:
 *   delete:
 *     summary: 게시물 삭제
 *     description: 특정 게시물과 관련된 모든 데이터(댓글, 좋아요)를 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: 게시물 slug
 *     responses:
 *       200:
 *         description: 게시물 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post deleted successfully"
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 게시물을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Invalid post slug' }, { status: 400 });
    }
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    await prisma.$transaction([
      prisma.comment.deleteMany({
        where: { postId: existingPost.id },
      }),
      prisma.like.deleteMany({
        where: { postId: existingPost.id },
      }),
      prisma.post.delete({
        where: { slug },
      }),
    ]);
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
