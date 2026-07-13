import { prisma } from "@/lib/db";
import { searchGames as searchIgdbGames } from "@/modules/igdb";
import type { Game } from "@/generated/prisma/client";

export async function searchGamesForPlatform(
  platformId: string,
  term: string,
): Promise<Game[]> {
  const local = await findLocal(platformId, term);
  if (local.length > 0) {
    return local;
  }

  const platform = await prisma.platform.findUnique({
    where: { id: platformId },
  });
  if (!platform || platform.igdbId === null) {
    return [];
  }

  const remote = await searchIgdbGames(term);
  const forPlatform = remote.filter((game) =>
    game.platformIds.includes(platform.igdbId!),
  );
  const persisted = await Promise.all(
    forPlatform.map((game) =>
      prisma.game.upsert({
        where: { igdbId_platformId: { igdbId: game.igdbId, platformId } },
        create: {
          igdbId: game.igdbId,
          name: game.name,
          slug: game.slug,
          platformId,
          coverUrl: game.coverUrl,
          releaseDate: game.releaseDate,
          summary: game.summary,
          source: "igdb",
        },
        update: {
          name: game.name,
          slug: game.slug,
          coverUrl: game.coverUrl,
          releaseDate: game.releaseDate,
          summary: game.summary,
        },
      }),
    ),
  );

  return persisted.sort((a, b) => a.name.localeCompare(b.name));
}

function findLocal(platformId: string, term: string): Promise<Game[]> {
  return prisma.game.findMany({
    where: { platformId, name: { contains: term, mode: "insensitive" } },
    orderBy: { name: "asc" },
  });
}
