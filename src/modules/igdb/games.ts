import { igdbQuery } from "./client";
import { resolveImageUrl } from "./images";
import { escapeSearchTerm } from "./query";
import type { IgdbGame } from "./types";

interface RawGame {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  first_release_date?: number;
  cover?: { url?: string };
  platforms?: number[];
}

export async function searchGames(term: string): Promise<IgdbGame[]> {
  const body = `search "${escapeSearchTerm(term)}"; fields name,slug,summary,first_release_date,cover.url,platforms; limit 20;`;
  const raw = await igdbQuery<RawGame[]>("games", body);
  return raw.map(mapGame);
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
