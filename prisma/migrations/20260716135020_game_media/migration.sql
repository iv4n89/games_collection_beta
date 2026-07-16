-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "mediaFetchedAt" TIMESTAMP(3),
ADD COLUMN     "screenshots" TEXT[],
ADD COLUMN     "videoId" TEXT;
