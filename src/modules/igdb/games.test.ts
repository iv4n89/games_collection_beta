import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./client", () => ({ igdbQuery: vi.fn() }));

import { igdbQuery } from "./client";
import {
  searchGames,
  getOfficialPlatformGames,
  getGameMedia,
} from "./games";

const mockedQuery = vi.mocked(igdbQuery);

afterEach(() => vi.clearAllMocks());

describe("getOfficialPlatformGames", () => {
  it("filtra a oficiales, ordena y pagina", async () => {
    mockedQuery.mockResolvedValue([]);

    await getOfficialPlatformGames(18, {
      offset: 24,
      limit: 24,
      sort: "name_desc",
    });

    const [, body] = mockedQuery.mock.calls[0];
    expect(body).toContain("platforms = (18)");
    expect(body).toContain("game_type = 0");
    expect(body).toContain("cover != null");
    expect(body).toContain("total_rating_count != null");
    expect(body).toContain("sort name desc;");
    expect(body).toContain("offset 24;");
  });

  it("sanea offset inválido y orden desconocido", async () => {
    mockedQuery.mockResolvedValue([]);

    await getOfficialPlatformGames(18, {
      offset: -5,
      limit: 24,
      sort: "boom" as never,
    });

    const [, body] = mockedQuery.mock.calls[0];
    expect(body).toContain("offset 0;");
    expect(body).toContain("sort name asc;");
  });
});

describe("getGameMedia", () => {
  it("resuelve capturas (máx 3) y toma el primer vídeo", async () => {
    mockedQuery.mockResolvedValue([
      {
        screenshots: [
          { url: "//images.igdb.com/igdb/image/upload/t_thumb/a.jpg" },
          { url: "//images.igdb.com/igdb/image/upload/t_thumb/b.jpg" },
          { url: "//images.igdb.com/igdb/image/upload/t_thumb/c.jpg" },
          { url: "//images.igdb.com/igdb/image/upload/t_thumb/d.jpg" },
        ],
        videos: [{ video_id: "abc123" }, { video_id: "zzz" }],
      },
    ]);

    const media = await getGameMedia(7346);

    expect(media.videoId).toBe("abc123");
    expect(media.screenshots).toEqual([
      "https://images.igdb.com/igdb/image/upload/t_screenshot_big/a.jpg",
      "https://images.igdb.com/igdb/image/upload/t_screenshot_big/b.jpg",
      "https://images.igdb.com/igdb/image/upload/t_screenshot_big/c.jpg",
    ]);
  });

  it("devuelve capturas vacías y sin vídeo cuando faltan", async () => {
    mockedQuery.mockResolvedValue([{ id: 1 }]);
    expect(await getGameMedia(1)).toEqual({
      screenshots: [],
      videoId: undefined,
    });
  });
});

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
