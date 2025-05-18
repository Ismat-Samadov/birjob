-- prisma/migrations/20250518_add_visitor_logs/migration.sql

-- CreateTable
CREATE TABLE "visitor_logs" (
    "id" SERIAL NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "browser" TEXT,
    "browserVersion" TEXT,
    "operatingSystem" TEXT,
    "osVersion" TEXT,
    "deviceType" TEXT,
    "deviceVendor" TEXT,
    "deviceModel" TEXT,
    "country" TEXT,
    "city" TEXT,
    "region" TEXT,
    "timezone" TEXT,
    "language" TEXT,
    "referrer" TEXT,
    "path" TEXT,
    "query" TEXT,
    "screenWidth" INTEGER,
    "screenHeight" INTEGER,
    "colorDepth" INTEGER,
    "viewportWidth" INTEGER,
    "viewportHeight" INTEGER,
    "connectionType" TEXT,
    "connectionSpeed" TEXT,
    "battery" DOUBLE PRECISION,
    "sessionId" TEXT,
    "previousVisitId" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visitor_logs_timestamp_idx" ON "visitor_logs"("timestamp");

-- CreateIndex  
CREATE INDEX "visitor_logs_sessionId_idx" ON "visitor_logs"("sessionId");

-- CreateIndex
CREATE INDEX "visitor_logs_ip_idx" ON "visitor_logs"("ip");