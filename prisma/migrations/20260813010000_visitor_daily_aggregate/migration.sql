-- VisitorLog(raw hit) → VisitorDaily(일별 unique 집계) 전환
-- 기존 IP 유니크 기록을 서울 날짜 기준으로 이관한 뒤 raw 로그 테이블 삭제

CREATE TABLE IF NOT EXISTS "VisitorDaily" (
    "date" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "VisitorDaily_pkey" PRIMARY KEY ("date")
);

-- 기존 VisitorLog가 있으면 날짜별 DISTINCT IP로 시드
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'VisitorLog'
  ) THEN
    INSERT INTO "VisitorDaily" ("date", "count")
    SELECT
      to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD') AS day,
      COUNT(DISTINCT "ip")::int AS count
    FROM "VisitorLog"
    GROUP BY 1
    ON CONFLICT ("date") DO UPDATE
    SET "count" = EXCLUDED."count";

    DROP TABLE "VisitorLog";
  END IF;
END $$;
