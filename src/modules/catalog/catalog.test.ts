import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/igdb", () => ({
  searchPlatforms: vi.fn(),
  searchGames: vi.fn(),
}));

import { prisma } from "@/lib/db";
import {
  searchGames as igdbSearchGames,
  searchPlatforms as igdbSearchPlatforms,
} from "@/modules/igdb";
import { searchPlatforms } from "./platforms";
import { searchGamesForPlatform } from "./games";

const igdbPlatforms = vi.mocked(igdbSearchPlatforms);
const igdbGames = vi.mocked(igdbSearchGames);

beforeEach(async () => {
  vi.clearAllMocks();
  await prisma.$executeRawUnsafe(
    'TRUNCATE "Game", "Platform" RESTART IDENTITY CASCADE',
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("searchPlatforms", () => {
  it("fetches from IGDB and persists when the local catalog is empty", async () => {
    igdbPlatforms.mockResolvedValue([
      {
        igdbId: 41,
        name: "Wii U",
        slug: "wiiu",
        generation: 8,
        logoUrl: "https://images.igdb.com/t_logo_med/logo.png",
      },
    ]);

    const result = await searchPlatforms("wii");

    expect(igdbPlatforms).toHaveBeenCalledOnce();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      igdbId: 41,
      name: "Wii U",
      slug: "wiiu",
      generation: 8,
      imageUrl: "https://images.igdb.com/t_logo_med/logo.png",
      source: "igdb",
    });

    const persisted = await prisma.platform.findMany();
    expect(persisted).toHaveLength(1);
  });

  it("returns local results without hitting IGDB when the catalog already matches", async () => {
    await prisma.platform.create({
      data: {
        igdbId: 130,
        name: "Nintendo Switch",
        slug: "switch",
        source: "igdb",
      },
    });

    const result = await searchPlatforms("switch");

    expect(igdbPlatforms).not.toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Nintendo Switch");
  });

  it("matches case-insensitively", async () => {
    await prisma.platform.create({
      data: { igdbId: 8, name: "PlayStation 2", slug: "ps2", source: "igdb" },
    });

    const result = await searchPlatforms("playstation");

    expect(result).toHaveLength(1);
  });
});

describe("searchGamesForPlatform", () => {
  it("persists only games available on the given platform, anchored to it", async () => {
    const platform = await prisma.platform.create({
      data: { igdbId: 41, name: "Wii U", slug: "wiiu", source: "igdb" },
    });
    igdbGames.mockResolvedValue([
      {
        igdbId: 7346,
        name: "Breath of the Wild",
        slug: "botw",
        platformIds: [41, 130],
        releaseDate: new Date("2017-03-03T00:00:00.000Z"),
        coverUrl: "https://images.igdb.com/t_cover_big/co.jpg",
        summary: "An open-world adventure.",
      },
      {
        igdbId: 99,
        name: "Other Console Game",
        slug: "ocg",
        platformIds: [7],
      },
    ]);

    const result = await searchGamesForPlatform(platform.id, "zelda");

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      igdbId: 7346,
      name: "Breath of the Wild",
      platformId: platform.id,
      source: "igdb",
    });

    const persisted = await prisma.game.findMany();
    expect(persisted).toHaveLength(1);
  });

  it("returns local games without hitting IGDB when present", async () => {
    const platform = await prisma.platform.create({
      data: { igdbId: 41, name: "Wii U", slug: "wiiu", source: "igdb" },
    });
    await prisma.game.create({
      data: {
        igdbId: 1,
        name: "Splatoon",
        slug: "splatoon",
        platformId: platform.id,
        source: "igdb",
      },
    });

    const result = await searchGamesForPlatform(platform.id, "splat");

    expect(igdbGames).not.toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Splatoon");
  });

  it("creates one row per platform for the same IGDB game", async () => {
    const wiiu = await prisma.platform.create({
      data: { igdbId: 41, name: "Wii U", slug: "wiiu", source: "igdb" },
    });
    const nswitch = await prisma.platform.create({
      data: { igdbId: 130, name: "Switch", slug: "switch", source: "igdb" },
    });
    igdbGames.mockResolvedValue([
      { igdbId: 7346, name: "BOTW", slug: "botw", platformIds: [41, 130] },
    ]);

    await searchGamesForPlatform(wiiu.id, "botw");
    await searchGamesForPlatform(nswitch.id, "botw");

    const persisted = await prisma.game.findMany();
    expect(persisted).toHaveLength(2);
    expect(new Set(persisted.map((g) => g.platformId))).toEqual(
      new Set([wiiu.id, nswitch.id]),
    );
  });

  it("returns nothing for a manual platform without an IGDB id", async () => {
    const platform = await prisma.platform.create({
      data: { name: "Homebrew", slug: "homebrew", source: "manual" },
    });

    const result = await searchGamesForPlatform(platform.id, "x");

    expect(result).toEqual([]);
    expect(igdbGames).not.toHaveBeenCalled();
  });
});
