import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;
const pooledUrl = databaseUrl
  ? `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}connection_limit=1`
  : undefined;

const prisma = new PrismaClient(
  pooledUrl
    ? {
        datasources: {
          db: { url: pooledUrl },
        },
      }
    : undefined,
);

const toCount = (value) => Number(value ?? 0);

const sequentialStats = async () => {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const totalPosts = await prisma.post.count();
  const thisMonthPosts = await prisma.post.count({ where: { createdAt: { gte: thisMonthStart } } });
  const lastMonthPosts = await prisma.post.count({
    where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
  });
  const totalUsers = await prisma.user.count();
  const thisMonthUsers = await prisma.user.count({ where: { createdAt: { gte: thisMonthStart } } });
  const lastMonthUsers = await prisma.user.count({
    where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
  });
  const totalComments = await prisma.comment.count();
  const thisMonthComments = await prisma.comment.count({ where: { createdAt: { gte: thisMonthStart } } });
  const lastMonthComments = await prisma.comment.count({
    where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
  });
  const totalViews = await prisma.post.aggregate({ _sum: { views: true } });
  const thisMonthViews = await prisma.post.aggregate({
    _sum: { views: true },
    where: { createdAt: { gte: thisMonthStart } },
  });
  const lastMonthViews = await prisma.post.aggregate({
    _sum: { views: true },
    where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
  });
  const extraUserCount = await prisma.user.count();
  const todayKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const todayRow = await prisma.visitorDaily.findUnique({ where: { date: todayKey } });
  const visitorAgg = await prisma.visitorDaily.aggregate({ _sum: { count: true } });

  return {
    posts: totalPosts + thisMonthPosts + lastMonthPosts,
    users: totalUsers + thisMonthUsers + lastMonthUsers + extraUserCount,
    comments: totalComments + thisMonthComments + lastMonthComments,
    views: (totalViews._sum.views ?? 0) + (thisMonthViews._sum.views ?? 0) + (lastMonthViews._sum.views ?? 0),
    visitors: (todayRow?.count ?? 0) + (visitorAgg._sum.count ?? 0),
  };
};

const singleQueryStats = async () => {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const todayKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

  const [row] = await prisma.$queryRaw`
    SELECT
      (SELECT COUNT(*)::int FROM "Post") AS "totalPosts",
      (SELECT COUNT(*)::int FROM "Post" WHERE "createdAt" >= ${thisMonthStart}) AS "thisMonthPosts",
      (SELECT COUNT(*)::int FROM "Post" WHERE "createdAt" >= ${lastMonthStart} AND "createdAt" < ${thisMonthStart}) AS "lastMonthPosts",
      (SELECT COUNT(*)::int FROM "User") AS "totalUsers",
      (SELECT COUNT(*)::int FROM "User" WHERE "createdAt" >= ${thisMonthStart}) AS "thisMonthUsers",
      (SELECT COUNT(*)::int FROM "User" WHERE "createdAt" >= ${lastMonthStart} AND "createdAt" < ${thisMonthStart}) AS "lastMonthUsers",
      (SELECT COUNT(*)::int FROM "Comment") AS "totalComments",
      (SELECT COUNT(*)::int FROM "Comment" WHERE "createdAt" >= ${thisMonthStart}) AS "thisMonthComments",
      (SELECT COUNT(*)::int FROM "Comment" WHERE "createdAt" >= ${lastMonthStart} AND "createdAt" < ${thisMonthStart}) AS "lastMonthComments",
      (SELECT COALESCE(SUM("views"), 0)::int FROM "Post") AS "totalViews",
      (SELECT COALESCE(SUM("views"), 0)::int FROM "Post" WHERE "createdAt" >= ${thisMonthStart}) AS "thisMonthViews",
      (SELECT COALESCE(SUM("views"), 0)::int FROM "Post" WHERE "createdAt" >= ${lastMonthStart} AND "createdAt" < ${thisMonthStart}) AS "lastMonthViews",
      (SELECT COALESCE((SELECT "count" FROM "VisitorDaily" WHERE "date" = ${todayKey}), 0)::int) AS "todayVisitors",
      (SELECT COALESCE(SUM("count"), 0)::int FROM "VisitorDaily") AS "totalVisitors"
  `;

  return toCount(row.totalPosts) + toCount(row.totalUsers) + toCount(row.totalComments);
};

const timeIt = async (label, fn, rounds = 5) => {
  await fn();
  const samples = [];
  for (let i = 0; i < rounds; i += 1) {
    const start = performance.now();
    await fn();
    samples.push(performance.now() - start);
  }
  const avg = samples.reduce((sum, value) => sum + value, 0) / samples.length;
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  console.log(
    JSON.stringify({
      label,
      rounds,
      avgMs: Number(avg.toFixed(1)),
      minMs: Number(min.toFixed(1)),
      maxMs: Number(max.toFixed(1)),
      samples: samples.map((value) => Number(value.toFixed(1))),
    }),
  );
};

const main = async () => {
  await timeIt('before-sequential-15-roundtrips', sequentialStats);
  await timeIt('after-single-sql', singleQueryStats);
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
