import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./client", () => ({ igdbQuery: vi.fn() }));

import { igdbQuery } from "./client";
import { searchPlatforms } from "./platforms";

const mockedQuery = vi.mocked(igdbQuery);

afterEach(() => vi.clearAllMocks());

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
