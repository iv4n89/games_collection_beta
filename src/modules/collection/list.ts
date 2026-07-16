import { prisma } from "@/lib/db";
import type { Game, Platform, UserItem } from "@/generated/prisma/client";
import { isComplete } from "./completeness";

export interface GameEntry {
  id: string;
  name: string;
  coverUrl: string | null;
  year: number | null;
  status: "owned" | "wishlist" | null;
  complete: boolean;
  onlyCartridge: boolean;
}

export async function buildGameEntries(
  userId: string | null,
  games: Game[],
): Promise<GameEntry[]> {
  const items = userId
    ? await getGameItems(
        userId,
        games.map((game) => game.id),
      )
    : new Map<string, UserItem>();
  return games.map((game) => {
    const item = items.get(game.id) ?? null;
    const owned = item?.ownership === "owned";
    return {
      id: game.id,
      name: game.name,
      coverUrl: game.coverUrl,
      year: game.releaseDate ? game.releaseDate.getFullYear() : null,
      status: item ? item.ownership : null,
      complete: owned ? isComplete(item) : false,
      onlyCartridge: owned
        ? item.hasGame === true && !item.hasBox && !item.hasManual
        : false,
    };
  });
}

export async function getPlatformWishlistGames(
  userId: string,
  platformId: string,
): Promise<GameEntry[]> {
  const items = await prisma.userItem.findMany({
    where: { userId, itemType: "game", ownership: "wishlist" },
    select: { catalogRefId: true },
  });
  const games = await prisma.game.findMany({
    where: { id: { in: items.map((item) => item.catalogRefId) }, platformId },
    orderBy: { name: "asc" },
  });
  return buildGameEntries(userId, games);
}

export interface PlatformCollection {
  console: UserItem | null;
  games: { item: UserItem; game: Game }[];
}

export interface UserPlatform {
  item: UserItem;
  platform: Platform;
}

export interface PlatformOverview {
  platform: Platform;
  total: number;
  owned: number;
}

export async function getPlatformsOverview(
  userId: string | null,
): Promise<PlatformOverview[]> {
  const platforms = (await prisma.platform.findMany()).sort((a, b) =>
    a.name.localeCompare(b.name, "es", { sensitivity: "base" }),
  );
  const counts = await prisma.game.groupBy({
    by: ["platformId"],
    _count: { _all: true },
  });
  const totalByPlatform = new Map(
    counts.map((count) => [count.platformId, count._count._all]),
  );

  const ownedByPlatform = new Map<string, number>();
  if (userId) {
    const ownedItems = await prisma.userItem.findMany({
      where: { userId, itemType: "game", ownership: "owned" },
      select: { catalogRefId: true },
    });
    const ownedGameIds = ownedItems.map((item) => item.catalogRefId);
    if (ownedGameIds.length > 0) {
      const ownedGames = await prisma.game.findMany({
        where: { id: { in: ownedGameIds } },
        select: { platformId: true },
      });
      for (const game of ownedGames) {
        ownedByPlatform.set(
          game.platformId,
          (ownedByPlatform.get(game.platformId) ?? 0) + 1,
        );
      }
    }
  }

  return platforms.map((platform) => ({
    platform,
    total: totalByPlatform.get(platform.id) ?? 0,
    owned: ownedByPlatform.get(platform.id) ?? 0,
  }));
}

export async function getUserPlatforms(
  userId: string,
): Promise<UserPlatform[]> {
  const items = await prisma.userItem.findMany({
    where: { userId, itemType: "platform" },
  });
  const platforms = await prisma.platform.findMany({
    where: { id: { in: items.map((item) => item.catalogRefId) } },
  });
  const platformById = new Map(
    platforms.map((platform) => [platform.id, platform]),
  );

  return items
    .map((item) => ({ item, platform: platformById.get(item.catalogRefId) }))
    .filter((entry): entry is UserPlatform => entry.platform !== undefined)
    .sort((a, b) => a.platform.name.localeCompare(b.platform.name));
}

export async function getPlatformCollection(
  userId: string,
  platformId: string,
): Promise<PlatformCollection> {
  const games = await prisma.game.findMany({ where: { platformId } });
  const gameById = new Map(games.map((game) => [game.id, game]));

  const items = await prisma.userItem.findMany({
    where: {
      userId,
      itemType: "game",
      catalogRefId: { in: games.map((game) => game.id) },
    },
  });

  const gameItems = items
    .map((item) => ({ item, game: gameById.get(item.catalogRefId) }))
    .filter(
      (entry): entry is { item: UserItem; game: Game } =>
        entry.game !== undefined,
    )
    .sort((a, b) => a.game.name.localeCompare(b.game.name));

  const consoleItem = await prisma.userItem.findUnique({
    where: {
      userId_itemType_catalogRefId: {
        userId,
        itemType: "platform",
        catalogRefId: platformId,
      },
    },
  });

  return { console: consoleItem, games: gameItems };
}

export function getConsoleItem(
  userId: string,
  platformId: string,
): Promise<UserItem | null> {
  return prisma.userItem.findUnique({
    where: {
      userId_itemType_catalogRefId: {
        userId,
        itemType: "platform",
        catalogRefId: platformId,
      },
    },
  });
}

export async function getGameItems(
  userId: string,
  gameIds: string[],
): Promise<Map<string, UserItem>> {
  const items = await prisma.userItem.findMany({
    where: { userId, itemType: "game", catalogRefId: { in: gameIds } },
  });
  return new Map(items.map((item) => [item.catalogRefId, item]));
}
