import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./client", () => ({ igdbQuery: vi.fn() }));

import { igdbQuery } from "./client";
import { searchGames } from "./games";

const mockedQuery = vi.mocked(igdbQuery);

afterEach(() => vi.clearAllMocks());

describe("searchGames", () => {
  it("builds a search query and maps the response", async () => {
    mockedQuery.mockResolvedValue([
      {
        id: 7346,
        name: "The Legend of Zelda: Breath of the Wild",
        slug: "the-legend-of-zelda-breath-of-the-wild",
        summary: "An open-world adventure.",
        first_release_date: 1488499200,
        cover: {
          url: "//images.igdb.com/igdb/image/upload/t_thumb/co3p2d.jpg",
        },
        platforms: [41, 130],
      },
    ]);

    const games = await searchGames("zelda");

    expect(mockedQuery).toHaveBeenCalledWith(
      "games",
      expect.stringContaining('search "zelda";'),
    );
    expect(games).toEqual([
      {
        igdbId: 7346,
        name: "The Legend of Zelda: Breath of the Wild",
        slug: "the-legend-of-zelda-breath-of-the-wild",
        summary: "An open-world adventure.",
        releaseDate: new Date(1488499200 * 1000),
        coverUrl:
          "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.jpg",
        platformIds: [41, 130],
      },
    ]);
  });

  it("maps missing optional fields to undefined and empty platforms", async () => {
    mockedQuery.mockResolvedValue([{ id: 1, name: "Bare", slug: "bare" }]);

    const [game] = await searchGames("bare");

    expect(game).toEqual({
      igdbId: 1,
      name: "Bare",
      slug: "bare",
      summary: undefined,
      releaseDate: undefined,
      coverUrl: undefined,
      platformIds: [],
    });
  });

  it("escapes quotes in the search term", async () => {
    mockedQuery.mockResolvedValue([]);

    await searchGames('some "quoted" title');

    expect(mockedQuery).toHaveBeenCalledWith(
      "games",
      expect.stringContaining('search "some \\"quoted\\" title";'),
    );
  });
});
