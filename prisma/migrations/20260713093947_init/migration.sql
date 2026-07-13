-- CreateEnum
CREATE TYPE "ItemSource" AS ENUM ('igdb', 'manual');

-- CreateEnum
CREATE TYPE "SpecialEditionBase" AS ENUM ('game', 'platform', 'accessory');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('game', 'platform', 'accessory', 'special_edition');

-- CreateEnum
CREATE TYPE "Ownership" AS ENUM ('owned', 'wishlist');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL,
    "igdbId" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "generation" INTEGER,
    "imageUrl" TEXT,
    "source" "ItemSource" NOT NULL DEFAULT 'igdb',

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "igdbId" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "coverUrl" TEXT,
    "releaseDate" TIMESTAMP(3),
    "summary" TEXT,
    "source" "ItemSource" NOT NULL DEFAULT 'igdb',

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accessory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platformId" TEXT,
    "imageUrl" TEXT,
    "source" "ItemSource" NOT NULL DEFAULT 'manual',

    CONSTRAINT "Accessory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialEdition" (
    "id" TEXT NOT NULL,
    "baseType" "SpecialEditionBase" NOT NULL,
    "baseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "notes" TEXT,

    CONSTRAINT "SpecialEdition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" "ItemType" NOT NULL,
    "catalogRefType" TEXT NOT NULL,
    "catalogRefId" TEXT NOT NULL,
    "ownership" "Ownership" NOT NULL DEFAULT 'owned',
    "hasGame" BOOLEAN,
    "hasBox" BOOLEAN,
    "hasManual" BOOLEAN,
    "hasConsole" BOOLEAN,
    "hasController" BOOLEAN,
    "hasCables" BOOLEAN,
    "hasAccessory" BOOLEAN,
    "condition" TEXT,
    "notes" TEXT,
    "acquisitionPrice" DECIMAL(65,30),
    "acquisitionDate" TIMESTAMP(3),
    "desiredMaxPrice" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceObservation" (
    "id" TEXT NOT NULL,
    "userItemId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "condition" TEXT,
    "availability" TEXT,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceObservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_igdbId_key" ON "Platform"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_slug_key" ON "Platform"("slug");

-- CreateIndex
CREATE INDEX "Game_platformId_idx" ON "Game"("platformId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_igdbId_platformId_key" ON "Game"("igdbId", "platformId");

-- CreateIndex
CREATE INDEX "SpecialEdition_baseType_baseId_idx" ON "SpecialEdition"("baseType", "baseId");

-- CreateIndex
CREATE INDEX "UserItem_userId_idx" ON "UserItem"("userId");

-- CreateIndex
CREATE INDEX "UserItem_catalogRefType_catalogRefId_idx" ON "UserItem"("catalogRefType", "catalogRefId");

-- CreateIndex
CREATE INDEX "PriceObservation_userItemId_seenAt_idx" ON "PriceObservation"("userItemId", "seenAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accessory" ADD CONSTRAINT "Accessory_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserItem" ADD CONSTRAINT "UserItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceObservation" ADD CONSTRAINT "PriceObservation_userItemId_fkey" FOREIGN KEY ("userItemId") REFERENCES "UserItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
