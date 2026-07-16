import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./client", () => ({ igdbQuery: vi.fn() }));

import { igdbQuery } from "./client";
import {
  searchPlatforms,
  getPlatformDetails,
  platformCategoryLabel,
  getPlatformGameCounts,
} from "./platforms";

const mockedQuery = vi.mocked(igdbQuery);

afterEach(() => vi.clearAllMocks());

describe("platformCategoryLabel", () => {
  it("traduce el nombre de platform_type a español", () => {
    expect(platformCategoryLabel("Console")).toBe("Consola de sobremesa");
    expect(platformCategoryLabel("Portable_console")).toBe("Consola portátil");
    expect(platformCategoryLabel("Arcade")).toBe("Arcade");
  });

  it("devuelve el nombre original si no está mapeado, y undefined si falta", () => {
    expect(platformCategoryLabel("Handheld_hybrid")).toBe("Handheld_hybrid");
    expect(platformCategoryLabel(undefined)).toBeUndefined();
  });
});

describe("getPlatformGameCounts", () => {
  it("agrupa por multiquery y parsea el nombre p{id} a conteo", async () => {
    mockedQuery.mockResolvedValue([
      { name: "p18", count: 332 },
      { name: "p19", count: 431 },
    ]);

    const counts = await getPlatformGameCounts([18, 19]);

    const [endpoint, body] = mockedQuery.mock.calls[0];
    expect(endpoint).toBe("multiquery");
    expect(body).toContain('query games/count "p18"');
    expect(body).toContain("platforms = (18)");
    expect(body).toContain("game_type = 0");
    expect(counts.get(18)).toBe(332);
    expect(counts.get(19)).toBe(431);
  });
});

describe("getPlatformDetails", () => {
  it("mapea platform_type.name a categoría y la summary de la versión", async () => {
    mockedQuery.mockResolvedValue([
      {
        id: 18,
        platform_type: { name: "Console" },
        versions: [{}, { summary: "La NES es una consola de 8 bits." }],
      },
    ]);

    const details = await getPlatformDetails(18);

    expect(details).toEqual({
      category: "Consola de sobremesa",
      summary: "La NES es una consola de 8 bits.",
    });
  });
});

describe("searchPlatforms", () => {
  it("builds a search query and maps the response", async () => {
    mockedQuery.mockResolvedValue([
      {
        id: 41,
        name: "Wii U",
        slug: "wiiu",
        generation: 8,
        platform_logo: {
          url: "//images.igdb.com/igdb/image/upload/t_thumb/logo.png",
        },
      },
    ]);

    const platforms = await searchPlatforms("wii");

    expect(mockedQuery).toHaveBeenCalledWith(
      "platforms",
      expect.stringContaining('search "wii";'),
    );
    expect(platforms).toEqual([
      {
        igdbId: 41,
        name: "Wii U",
        slug: "wiiu",
        generation: 8,
        logoUrl:
          "https://images.igdb.com/igdb/image/upload/t_logo_med/logo.png",
      },
    ]);
  });

  it("maps missing optional fields to undefined", async () => {
    mockedQuery.mockResolvedValue([{ id: 5, name: "NES", slug: "nes" }]);

    const [platform] = await searchPlatforms("nes");

    expect(platform).toEqual({
      igdbId: 5,
      name: "NES",
      slug: "nes",
      generation: undefined,
      logoUrl: undefined,
    });
  });
});
