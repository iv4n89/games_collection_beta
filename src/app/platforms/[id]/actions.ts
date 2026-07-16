"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { requireUser } from "@/lib/session";
import {
  addItem,
  buildGameEntries,
  type GameEntry,
} from "@/modules/collection";
import { getPlatformGamesPage, searchPlatformGames } from "@/modules/catalog";
import type { GameSort } from "@/modules/igdb";
import type { Ownership } from "@/generated/prisma/client";

const GAMES_PAGE_SIZE = 24;

export async function loadPlatformGames(
  platformId: string,
  offset: number,
  sort: GameSort,
): Promise<GameEntry[]> {
  const session = await auth();
  const games = await getPlatformGamesPage(platformId, {
    offset,
    limit: GAMES_PAGE_SIZE,
    sort,
  });
  return buildGameEntries(session?.user?.id ?? null, games);
}

export async function searchPlatformGamesAction(
  platformId: string,
  term: string,
): Promise<GameEntry[]> {
  const session = await auth();
  const games = await searchPlatformGames(platformId, term, 30);
  return buildGameEntries(session?.user?.id ?? null, games);
}

export async function addGameToCollection(
  platformId: string,
  gameId: string,
  ownership: Ownership,
) {
  const user = await requireUser();
  await addItem(user.id, {
    itemType: "game",
    catalogRefId: gameId,
    ownership,
    components:
      ownership === "owned"
        ? { hasGame: true, hasBox: true, hasManual: true }
        : undefined,
  });
  revalidatePath(`/platforms/${platformId}`);
}

export async function setConsoleOwnership(
  platformId: string,
  ownership: Ownership,
) {
  const user = await requireUser();
  await addItem(user.id, {
    itemType: "platform",
    catalogRefId: platformId,
    ownership,
    components:
      ownership === "owned"
        ? {
            hasConsole: true,
            hasController: true,
            hasCables: true,
            hasBox: true,
            hasManual: true,
          }
        : undefined,
  });
  revalidatePath(`/platforms/${platformId}`);
}
