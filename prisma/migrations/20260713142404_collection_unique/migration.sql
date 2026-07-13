-- DropIndex
DROP INDEX "UserItem_catalogRefType_catalogRefId_idx";

-- DropIndex
DROP INDEX "UserItem_userId_idx";

-- AlterTable
ALTER TABLE "UserItem" DROP COLUMN "catalogRefType";

-- CreateIndex
CREATE INDEX "UserItem_itemType_catalogRefId_idx" ON "UserItem"("itemType", "catalogRefId");

-- CreateIndex
CREATE UNIQUE INDEX "UserItem_userId_itemType_catalogRefId_key" ON "UserItem"("userId", "itemType", "catalogRefId");

