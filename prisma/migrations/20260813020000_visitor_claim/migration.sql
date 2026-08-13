-- 브라우저당 일별 1회 집계를 원자적으로 보장하는 클레임 테이블
CREATE TABLE IF NOT EXISTS "VisitorClaim" (
    "date" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VisitorClaim_pkey" PRIMARY KEY ("date", "visitorId")
);
