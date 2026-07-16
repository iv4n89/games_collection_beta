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
  versions?: { summary?: string }[];
}

// IGDB no rellena `summary` en platforms; la descripción vive en la versión.
function pickSummary(platform: RawPlatform): string | undefined {
  return platform.versions?.find((version) => version.summary)?.summary;
}

export async function searchPlatforms(term: string): Promise<IgdbPlatform[]> {
  const body = `search "${escapeSearchTerm(term)}"; fields name,slug,generation,platform_logo.url,versions.summary; limit 20;`;
  const raw = await igdbQuery<RawPlatform[]>("platforms", body);
  return raw.map(mapPlatform);
}

export async function getPlatformSummary(
  igdbId: number,
): Promise<string | undefined> {
  const body = `fields versions.summary; where id = ${igdbId};`;
  const raw = await igdbQuery<RawPlatform[]>("platforms", body);
  return raw[0] ? pickSummary(raw[0]) : undefined;
}

function mapPlatform(platform: RawPlatform): IgdbPlatform {
  return {
    igdbId: platform.id,
    name: platform.name,
    slug: platform.slug,
    generation: platform.generation,
    logoUrl: resolveImageUrl(platform.platform_logo?.url, "t_logo_med"),
    summary: pickSummary(platform),
  };
}
