-- CreateEnum
CREATE TYPE "StatKind" AS ENUM ('COUNTING', 'DERIVED');

-- CreateEnum
CREATE TYPE "StatFormat" AS ENUM ('INTEGER', 'DECIMAL_1', 'PERCENT');

-- CreateTable
CREATE TABLE "StatDefinition" (
    "id" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "shortLabel" TEXT NOT NULL,
    "kind" "StatKind" NOT NULL,
    "format" "StatFormat" NOT NULL DEFAULT 'INTEGER',
    "formula" TEXT,
    "higherIsBetter" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerGameStat" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "values" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerGameStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StatDefinition_sportId_sortOrder_idx" ON "StatDefinition"("sportId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "StatDefinition_sportId_key_key" ON "StatDefinition"("sportId", "key");

-- CreateIndex
CREATE INDEX "PlayerGameStat_playerId_gameId_idx" ON "PlayerGameStat"("playerId", "gameId");

-- CreateIndex
CREATE INDEX "PlayerGameStat_teamId_gameId_idx" ON "PlayerGameStat"("teamId", "gameId");

-- CreateIndex
CREATE INDEX "PlayerGameStat_values_idx" ON "PlayerGameStat" USING GIN ("values");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerGameStat_gameId_playerId_key" ON "PlayerGameStat"("gameId", "playerId");

-- AddForeignKey
ALTER TABLE "StatDefinition" ADD CONSTRAINT "StatDefinition_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGameStat" ADD CONSTRAINT "PlayerGameStat_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGameStat" ADD CONSTRAINT "PlayerGameStat_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGameStat" ADD CONSTRAINT "PlayerGameStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
