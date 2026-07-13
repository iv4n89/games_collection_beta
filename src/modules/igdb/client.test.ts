import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { igdbQuery } from "./client";
import { _resetTokenCache } from "./token";

beforeEach(() => {
  _resetTokenCache();
  process.env.TWITCH_CLIENT_ID = "id";
  process.env.TWITCH_CLIENT_SECRET = "secret";
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubFetch(igdbResponse: {
  ok: boolean;
  status?: number;
  body?: unknown;
}) {
  const fetchMock = vi.fn(async (url: string, _options?: RequestInit) => {
    if (String(url).includes("id.twitch.tv")) {
      return {
        ok: true,
        json: async () => ({ access_token: "tok", expires_in: 3600 }),
      };
    }
    return {
      ok: igdbResponse.ok,
      status: igdbResponse.status,
      json: async () => igdbResponse.body,
    };
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("igdbQuery", () => {
  it("posts the query to the igdb endpoint with auth headers", async () => {
    const fetchMock = stubFetch({ ok: true, body: [{ id: 1 }] });

    const result = await igdbQuery("games", "fields name; limit 1;");

    expect(result).toEqual([{ id: 1 }]);
    const igdbCall = fetchMock.mock.calls.find(([u]) =>
      String(u).includes("api.igdb.com"),
    );
    expect(igdbCall).toBeDefined();
    const [url, options] = igdbCall as [string, RequestInit];
    expect(url).toBe("https://api.igdb.com/v4/games");
    expect(options.method).toBe("POST");
    const headers = options.headers as Record<string, string>;
    expect(headers["Client-ID"]).toBe("id");
    expect(headers["Authorization"]).toBe("Bearer tok");
    expect(options.body).toBe("fields name; limit 1;");
  });

  it("throws on a non-ok response", async () => {
    stubFetch({ ok: false, status: 429 });
    await expect(igdbQuery("games", "")).rejects.toThrow(/429/);
  });
});
