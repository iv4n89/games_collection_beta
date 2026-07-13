import { prisma } from "@/lib/db";
import type { Game, UserItem } from "@/generated/prisma/client";

export interface PlatformCollection {
  console: UserItem | null;
  games: { item: UserItem; game: Game }[];
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
