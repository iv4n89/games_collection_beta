import { prisma } from "@/lib/db";
import {
  searchGames as searchIgdbGames,
  getPopularGames,
  getOfficialPlatformGames,
  searchOfficialPlatformGames,
  getGameMedia,
  type GameSort,
} from "@/modules/igdb";
import type { IgdbGame } from "@/modules/igdb";
import type { Game, Prisma } from "@/generated/prisma/client";

const GAME_ORDER_BY: Record<GameSort, Prisma.GameOrderByWithRelationInput> = {
  name_asc: { name: "asc" },
  name_desc: { name: "desc" },
  year_desc: { releaseDate: "desc" },
  year_asc: { releaseDate: "asc" },
};

export function getGame(id: string): Promise<Game | null> {
  return prisma.game.findUnique({ where: { id } });
}

export async function getGameWithMedia(id: string): Promise<Game | null> {
  const game = await prisma.game.findUnique({ where: { id } });
  if (!game || game.igdbId === null || game.mediaFetchedAt !== null) {
    return game;
  }
  let media: { screenshots: string[]; videoId?: string };
  try {
    media = await getGameMedia(game.igdbId);
  } catch {
    return game;
  }
  return prisma.game.update({
    where: { id },
    data: {
      screenshots: media.screenshots,
      videoId: media.videoId ?? null,
      mediaFetchedAt: new Date(),
    },
  });
}

function upsertPlatformGames(
  platformId: string,
  games: IgdbGame[],
): Promise<Game[]> {
  return Promise.all(
    games.map((game) =>
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
}

// Página de juegos oficiales de la plataforma (desde IGDB, cacheando al vuelo).
// Si IGDB falla, degrada a los juegos ya cacheados en vez de romper el render.
export async function getPlatformGamesPage(
  platformId: string,
  options: { offset: number; limit: number; sort: GameSort },
): Promise<Game[]> {
  // Saneado una vez (los args llegan de una server action pública): se reusa
  // tanto para IGDB como para el fallback a Prisma (skip no admite negativos).
  const offset =
    Number.isInteger(options.offset) && options.offset >= 0
      ? options.offset
      : 0;
  const sort = options.sort in GAME_ORDER_BY ? options.sort : "name_asc";
  const platform = await prisma.platform.findUnique({
    where: { id: platformId },
  });
  if (!platform || platform.igdbId === null) {
    return [];
  }
  try {
    const games = await getOfficialPlatformGames(platform.igdbId, {
      offset,
      limit: options.limit,
      sort,
    });
    return await upsertPlatformGames(platformId, games);
  } catch {
    return prisma.game.findMany({
      where: { platformId },
      orderBy: GAME_ORDER_BY[sort],
      skip: offset,
      take: options.limit,
    });
  }
}

export async function searchPlatformGames(
  platformId: string,
  term: string,
  limit: number,
): Promise<Game[]> {
  const platform = await prisma.platform.findUnique({
    where: { id: platformId },
  });
  if (!platform || platform.igdbId === null) {
    return [];
  }
  try {
    const games = await searchOfficialPlatformGames(
      platform.igdbId,
      term,
      limit,
    );
    return await upsertPlatformGames(platformId, games);
  } catch {
    return prisma.game.findMany({
      where: { platformId, name: { contains: term, mode: "insensitive" } },
      orderBy: { name: "asc" },
      take: limit,
    });
  }
}

export async function getShowcaseGames(limit: number): Promise<Game[]> {
  const local = await randomLocalGames(limit);
  if (local.length >= limit) {
    return local;
  }
  await seedPopularGames(limit);
  return randomLocalGames(limit);
}

async function randomLocalGames(limit: number): Promise<Game[]> {
  const ids = (await prisma.game.findMany({ select: { id: true } })).map(
    (game) => game.id,
  );
  const sample = shuffle(ids).slice(0, limit);
  const games = await prisma.game.findMany({ where: { id: { in: sample } } });
  const byId = new Map(games.map((game) => [game.id, game]));
  return sample.map((id) => byId.get(id)!);
}

async function seedPopularGames(count: number): Promise<void> {
  const popular = await getPopularGames(count * 2);
  for (const game of popular) {
    const platform = game.platforms[0];
    if (!platform) {
      continue;
    }
    const dbPlatform = await prisma.platform.upsert({
      where: { igdbId: platform.igdbId },
      create: {
        igdbId: platform.igdbId,
        name: platform.name,
        slug: platform.slug,
        generation: platform.generation,
        imageUrl: platform.logoUrl,
        source: "igdb",
      },
      update: {
        name: platform.name,
        slug: platform.slug,
        generation: platform.generation,
        imageUrl: platform.logoUrl,
      },
    });
    await prisma.game.upsert({
      where: {
        igdbId_platformId: { igdbId: game.igdbId, platformId: dbPlatform.id },
      },
      create: {
        igdbId: game.igdbId,
        name: game.name,
        slug: game.slug,
        platformId: dbPlatform.id,
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
    });
  }
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

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
