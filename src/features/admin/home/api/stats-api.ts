import { cache } from 'react';
import prisma from '@/shared/lib/db';
import { withPrismaRetry } from '@/shared/lib/with-prisma-retry';

export type AdminStats = {
  posts: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  users: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  comments: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  views: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
};

/** Supabase session pool burst 방지: 요청당 1회, 쿼리는 순차 실행 */
export const getStats = cache(async (): Promise<AdminStats> => {
  return withPrismaRetry(async () => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const totalPosts = await prisma.post.count();
    const thisMonthPosts = await prisma.post.count({
      where: { createdAt: { gte: thisMonthStart } },
    });
    const lastMonthPosts = await prisma.post.count({
      where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
    });

    const totalUsers = await prisma.user.count();
    const thisMonthUsers = await prisma.user.count({
      where: { createdAt: { gte: thisMonthStart } },
    });
    const lastMonthUsers = await prisma.user.count({
      where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
    });

    const totalComments = await prisma.comment.count();
    const thisMonthComments = await prisma.comment.count({
      where: { createdAt: { gte: thisMonthStart } },
    });
    const lastMonthComments = await prisma.comment.count({
      where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
    });

    const totalViews = await prisma.post.aggregate({ _sum: { views: true } });
    const thisMonthViews = await prisma.post.aggregate({
      _sum: { views: true },
      where: { createdAt: { gte: thisMonthStart } },
    });
    const lastMonthViews = await prisma.post.aggregate({
      _sum: { views: true },
      where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
    });

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
        total: totalViews._sum.views ?? 0,
        thisMonth: thisMonthViews._sum.views ?? 0,
        lastMonth: lastMonthViews._sum.views ?? 0,
      },
    };
  });
});
