import prisma from '@/shared/lib/db';

export const getStats = async () => {
  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // 게시물 통계
    const [totalPosts, thisMonthPosts, lastMonthPosts] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({
        where: {
          createdAt: {
            gte: thisMonthStart,
          },
        },
      }),
      prisma.post.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),
    ]);

    // 사용자 통계
    const [totalUsers, thisMonthUsers, lastMonthUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: thisMonthStart,
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),
    ]);

    // 댓글 통계
    const [totalComments, thisMonthComments, lastMonthComments] = await Promise.all([
      prisma.comment.count(),
      prisma.comment.count({
        where: {
          createdAt: {
            gte: thisMonthStart,
          },
        },
      }),
      prisma.comment.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),
    ]);

    // 조회수 통계
    const [totalViews, thisMonthViews, lastMonthViews] = await Promise.all([
      prisma.post.aggregate({
        _sum: {
          views: true,
        },
      }),
      prisma.post.aggregate({
        _sum: {
          views: true,
        },
        where: {
          createdAt: {
            gte: thisMonthStart,
          },
        },
      }),
      prisma.post.aggregate({
        _sum: {
          views: true,
        },
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),
    ]);

    return {
      posts: {
        total: totalPosts,
        thisMonth: thisMonthPosts,
        lastMonth: lastMonthPosts,
      },
      users: {
        total: totalUsers,
        thisMonth: thisMonthUsers,
        lastMonth: lastMonthUsers,
      },
      comments: {
        total: totalComments,
        thisMonth: thisMonthComments,
        lastMonth: lastMonthComments,
      },
      views: {
        total: totalViews._sum.views || 0,
        thisMonth: thisMonthViews._sum.views || 0,
        lastMonth: lastMonthViews._sum.views || 0,
      },
    };
  } catch (error) {
    console.error('Failed to get stats:', error);
    throw new Error('Failed to fetch stats');
  }
};
