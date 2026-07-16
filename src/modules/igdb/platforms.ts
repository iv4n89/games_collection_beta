import { igdbQuery } from "./client";
import { resolveImageUrl } from "./images";
import { escapeSearchTerm } from "./query";
import type { IgdbPlatform } from "./types";

interface RawPlatform {
  id: number;
  name: string;
  slug: string;
  generation?: number;
  platform_type?: { name?: string };
  platform_logo?: { url?: string };
  versions?: { summary?: string }[];
}

// `platform_type` es una referencia con su propio espacio de ids; se traduce
// por nombre, no por id (el enum numérico pertenece al campo `category` viejo).
const CATEGORY_LABELS: Record<string, string> = {
  console: "Consola de sobremesa",
  portable_console: "Consola portátil",
  arcade: "Arcade",
  computer: "Ordenador",
  operating_system: "Sistema operativo",
  platform: "Plataforma",
};

export function platformCategoryLabel(
  typeName: string | undefined,
): string | undefined {
  if (!typeName) {
    return undefined;
  }
  return CATEGORY_LABELS[typeName.toLowerCase()] ?? typeName;
}

// IGDB no rellena `summary` en platforms; la descripción vive en la versión.
function pickSummary(platform: RawPlatform): string | undefined {
  return platform.versions?.find((version) => version.summary)?.summary;
}

export async function searchPlatforms(term: string): Promise<IgdbPlatform[]> {
  const body = `search "${escapeSearchTerm(term)}"; fields name,slug,generation,platform_type.name,platform_logo.url,versions.summary; limit 20;`;
  const raw = await igdbQuery<RawPlatform[]>("platforms", body);
  return raw.map(mapPlatform);
}

export async function getPlatformDetails(
  igdbId: number,
): Promise<{ summary?: string; category?: string }> {
  const body = `fields platform_type.name,versions.summary; where id = ${igdbId};`;
  const raw = await igdbQuery<RawPlatform[]>("platforms", body);
  const platform = raw[0];
  if (!platform) {
    return {};
  }
  return {
    summary: pickSummary(platform),
    category: platformCategoryLabel(platform.platform_type?.name),
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
    category: platformCategoryLabel(platform.platform_type?.name),
  };
}
