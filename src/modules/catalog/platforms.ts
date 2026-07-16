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
  if (
    !platform ||
    platform.igdbId === null ||
    (platform.summary !== null && platform.category !== null)
  ) {
    return platform;
  }
  const details = await getPlatformDetails(platform.igdbId);
  if (!details.summary && !details.category) {
    return platform;
  }
  return prisma.platform.update({
    where: { id },
    data: {
      summary: platform.summary ?? details.summary ?? null,
      category: platform.category ?? details.category ?? null,
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
