import { igdbQuery } from "./client";
import { resolveImageUrl } from "./images";
import { escapeSearchTerm } from "./query";
import type { IgdbGame, IgdbPopularGame } from "./types";

interface RawGame {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  first_release_date?: number;
  cover?: { url?: string };
  platforms?: number[];
}

interface RawPlatform {
  id: number;
  name: string;
  slug: string;
  generation?: number;
  platform_logo?: { url?: string };
}

interface RawPopularGame {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  first_release_date?: number;
  cover?: { url?: string };
  platforms?: RawPlatform[];
}

export async function searchGames(term: string): Promise<IgdbGame[]> {
  const body = `search "${escapeSearchTerm(term)}"; fields name,slug,summary,first_release_date,cover.url,platforms; limit 20;`;
  const raw = await igdbQuery<RawGame[]>("games", body);
  return raw.map(mapGame);
}

export async function getPopularGamesForPlatform(
  platformIgdbId: number,
  limit: number,
): Promise<IgdbGame[]> {
  const body = `fields name,slug,summary,first_release_date,cover.url,platforms; where platforms = (${platformIgdbId}) & cover != null & total_rating_count != null; sort total_rating_count desc; limit ${limit};`;
  const raw = await igdbQuery<RawGame[]>("games", body);
  return raw.map(mapGame);
}

interface RawGameMedia {
  screenshots?: { url?: string }[];
  videos?: { video_id?: string }[];
}

export async function getGameMedia(
  igdbId: number,
): Promise<{ screenshots: string[]; videoId?: string }> {
  const body = `fields screenshots.url,videos.video_id; where id = ${igdbId};`;
  const raw = await igdbQuery<RawGameMedia[]>("games", body);
  const game = raw[0];
  if (!game) {
    return { screenshots: [] };
  }
  const screenshots = (game.screenshots ?? [])
    .map((shot) => resolveImageUrl(shot.url, "t_screenshot_big"))
    .filter((url): url is string => Boolean(url))
    .slice(0, 3);
  const videoId = game.videos?.find((video) => video.video_id)?.video_id;
  return { screenshots, videoId };
}

export type GameSort = "name_asc" | "name_desc" | "year_desc" | "year_asc";

const SORT_CLAUSES: Record<GameSort, string> = {
  name_asc: "sort name asc;",
  name_desc: "sort name desc;",
  year_desc: "sort first_release_date desc;",
  year_asc: "sort first_release_date asc;",
};

// Juegos oficiales (game_type = 0 = Main Game) de una plataforma, paginados.
export async function getOfficialPlatformGames(
  platformIgdbId: number,
  { offset, limit, sort }: { offset: number; limit: number; sort: GameSort },
): Promise<IgdbGame[]> {
  const body = `fields name,slug,summary,first_release_date,cover.url,platforms; where platforms = (${platformIgdbId}) & game_type = 0 & cover != null & total_rating_count != null; ${SORT_CLAUSES[sort]} limit ${limit}; offset ${offset};`;
  const raw = await igdbQuery<RawGame[]>("games", body);
  return raw.map(mapGame);
}

export async function searchOfficialPlatformGames(
  platformIgdbId: number,
  term: string,
  limit: number,
): Promise<IgdbGame[]> {
  const body = `search "${escapeSearchTerm(term)}"; fields name,slug,summary,first_release_date,cover.url,platforms; where platforms = (${platformIgdbId}) & game_type = 0 & cover != null & total_rating_count != null; limit ${limit};`;
  const raw = await igdbQuery<RawGame[]>("games", body);
  return raw.map(mapGame);
}

export async function getPopularGames(
  limit: number,
): Promise<IgdbPopularGame[]> {
  const body = `fields name,slug,summary,first_release_date,cover.url,platforms.name,platforms.slug,platforms.generation,platforms.platform_logo.url; where cover != null & total_rating_count != null & platforms != null; sort total_rating_count desc; limit ${limit};`;
  const raw = await igdbQuery<RawPopularGame[]>("games", body);
  return raw.map(mapPopularGame);
}

function mapPopularGame(game: RawPopularGame): IgdbPopularGame {
  return {
    igdbId: game.id,
    name: game.name,
    slug: game.slug,
    summary: game.summary,
    releaseDate: game.first_release_date
      ? new Date(game.first_release_date * 1000)
      : undefined,
    coverUrl: resolveImageUrl(game.cover?.url, "t_cover_big"),
    platforms: (game.platforms ?? []).map((platform) => ({
      igdbId: platform.id,
      name: platform.name,
      slug: platform.slug,
      generation: platform.generation,
      logoUrl: resolveImageUrl(platform.platform_logo?.url, "t_logo_med"),
    })),
  };
}

function mapGame(game: RawGame): IgdbGame {
  return {
    igdbId: game.id,
    name: game.name,
    slug: game.slug,
    summary: game.summary,
    releaseDate: game.first_release_date
      ? new Date(game.first_release_date * 1000)
      : undefined,
    coverUrl: resolveImageUrl(game.cover?.url, "t_cover_big"),
    platformIds: game.platforms ?? [],
  };
}
