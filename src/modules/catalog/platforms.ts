import { prisma } from "@/lib/db";
import {
  searchPlatforms as searchIgdbPlatforms,
  getPlatformDetails,
} from "@/modules/igdb";
import type { Accessory, Platform, SpecialEdition } from "@/generated/prisma/client";

export function getPlatform(id: string): Promise<Platform | null> {
  return prisma.platform.findUnique({ where: { id } });
}

export async function getPlatformWithSummary(
  id: string,
): Promise<Platform | null> {
  const platform = await prisma.platform.findUnique({ where: { id } });
  if (!platform || platform.igdbId === null || platform.enrichedAt !== null) {
    return platform;
  }
  let details: { summary?: string; category?: string };
  try {
    details = await getPlatformDetails(platform.igdbId);
  } catch {
    // IGDB no disponible: se muestra lo cacheado y se reintenta en otra visita.
    return platform;
  }
  return prisma.platform.update({
    where: { id },
    data: {
      summary: platform.summary ?? details.summary ?? null,
      category: platform.category ?? details.category ?? null,
      enrichedAt: new Date(),
    },
  });
}

export function getPlatformAccessories(
  platformId: string,
): Promise<Accessory[]> {
  return prisma.accessory.findMany({
    where: { platformId },
    orderBy: { name: "asc" },
  });
}

export function getPlatformEditions(
  platformId: string,
): Promise<SpecialEdition[]> {
  return prisma.specialEdition.findMany({
    where: { baseType: "platform", baseId: platformId },
    orderBy: { name: "asc" },
  });
}

export async function searchPlatforms(term: string): Promise<Platform[]> {
  const local = await findLocal(term);
  if (local.length > 0) {
    return local;
  }

  const remote = await searchIgdbPlatforms(term);
  const persisted = await Promise.all(
    remote.map((platform) =>
      prisma.platform.upsert({
        where: { igdbId: platform.igdbId },
        create: {
          igdbId: platform.igdbId,
          name: platform.name,
          slug: platform.slug,
          generation: platform.generation,
          imageUrl: platform.logoUrl,
          summary: platform.summary,
          category: platform.category,
          source: "igdb",
        },
        update: {
          name: platform.name,
          slug: platform.slug,
          generation: platform.generation,
          imageUrl: platform.logoUrl,
          summary: platform.summary,
          category: platform.category,
        },
      }),
    ),
  );

  return persisted.sort((a, b) => a.name.localeCompare(b.name));
}

function findLocal(term: string): Promise<Platform[]> {
  return prisma.platform.findMany({
    where: { name: { contains: term, mode: "insensitive" } },
    orderBy: { name: "asc" },
  });
}
