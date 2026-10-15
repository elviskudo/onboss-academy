ALTER TABLE "VisitorEvent" ADD COLUMN "userId" TEXT;
ALTER TABLE "VisitorEvent" ADD COLUMN "referrer" TEXT;
ALTER TABLE "VisitorEvent" ADD COLUMN "device" TEXT;
ALTER TABLE "VisitorEvent" ADD COLUMN "country" TEXT;
ALTER TABLE "VisitorEvent" ADD COLUMN "ipHash" TEXT;
CREATE INDEX "VisitorEvent_path_idx" ON "VisitorEvent"("path");
CREATE INDEX "VisitorEvent_country_idx" ON "VisitorEvent"("country");
