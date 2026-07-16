import { igdbQuery } from "./client";
import { resolveImageUrl } from "./images";
import { escapeSearchTerm } from "./query";
import type { IgdbPlatform } from "./types";

interface RawPlatform {
  id: number;
  name: string;
  slug: string;
  generation?: number;
  platform_type?: number;
  platform_logo?: { url?: string };
  versions?: { summary?: string }[];
}

const CATEGORY_LABELS: Record<number, string> = {
  1: "Consola de sobremesa",
  2: "Arcade",
  3: "Plataforma",
  4: "Sistema operativo",
  5: "Consola portátil",
  6: "Ordenador",
};

// IGDB no rellena `summary` en platforms; la descripción vive en la versión.
function pickSummary(platform: RawPlatform): string | undefined {
  return platform.versions?.find((version) => version.summary)?.summary;
}

function categoryLabel(category: number | undefined): string | undefined {
  return category !== undefined ? CATEGORY_LABELS[category] : undefined;
}

export async function searchPlatforms(term: string): Promise<IgdbPlatform[]> {
  const body = `search "${escapeSearchTerm(term)}"; fields name,slug,generation,platform_type,platform_logo.url,versions.summary; limit 20;`;
  const raw = await igdbQuery<RawPlatform[]>("platforms", body);
  return raw.map(mapPlatform);
}

export async function getPlatformDetails(
  igdbId: number,
): Promise<{ summary?: string; category?: string }> {
  const body = `fields platform_type,versions.summary; where id = ${igdbId};`;
  const raw = await igdbQuery<RawPlatform[]>("platforms", body);
  const platform = raw[0];
  if (!platform) {
    return {};
  }
  return {
    summary: pickSummary(platform),
    category: categoryLabel(platform.platform_type),
  };
}

function mapPlatform(platform: RawPlatform): IgdbPlatform {
  return {
    igdbId: platform.id,
    name: platform.name,
    slug: platform.slug,
    generation: platform.generation,
    logoUrl: resolveImageUrl(platform.platform_logo?.url, "t_logo_med"),
    summary: pickSummary(platform),
    category: categoryLabel(platform.platform_type),
  };
}
