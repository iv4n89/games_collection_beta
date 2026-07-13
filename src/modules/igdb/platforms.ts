import { igdbQuery } from "./client";
import { resolveImageUrl } from "./images";
import { escapeSearchTerm } from "./query";
import type { IgdbPlatform } from "./types";

interface RawPlatform {
  id: number;
  name: string;
  slug: string;
  generation?: number;
  platform_logo?: { url?: string };
}

export async function searchPlatforms(term: string): Promise<IgdbPlatform[]> {
  const body = `search "${escapeSearchTerm(term)}"; fields name,slug,generation,platform_logo.url; limit 20;`;
  const raw = await igdbQuery<RawPlatform[]>("platforms", body);
  return raw.map(mapPlatform);
}

function mapPlatform(platform: RawPlatform): IgdbPlatform {
  return {
    igdbId: platform.id,
    name: platform.name,
    slug: platform.slug,
    generation: platform.generation,
    logoUrl: resolveImageUrl(platform.platform_logo?.url, "t_logo_med"),
  };
}
