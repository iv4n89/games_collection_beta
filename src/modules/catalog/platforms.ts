import { prisma } from "@/lib/db";
import { searchPlatforms as searchIgdbPlatforms } from "@/modules/igdb";
import type { Platform } from "@/generated/prisma/client";

export function getPlatform(id: string): Promise<Platform | null> {
  return prisma.platform.findUnique({ where: { id } });
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
          source: "igdb",
        },
        update: {
          name: platform.name,
          slug: platform.slug,
          generation: platform.generation,
          imageUrl: platform.logoUrl,
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
