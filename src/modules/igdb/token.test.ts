import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAccessToken, _resetTokenCache } from "./token";

function mockTokenFetch(token = "tok", expiresIn = 3600) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ access_token: token, expires_in: expiresIn }),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => {
  _resetTokenCache();
  process.env.TWITCH_CLIENT_ID = "id";
  process.env.TWITCH_CLIENT_SECRET = "secret";
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("getAccessToken", () => {
  it("requests a token and returns it", async () => {
    const fetchMock = mockTokenFetch("abc");
    expect(await getAccessToken()).toBe("abc");
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("caches the token across calls", async () => {
    const fetchMock = mockTokenFetch("abc");
    await getAccessToken();
    await getAccessToken();
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("renews the token after expiry", async () => {
    vi.useFakeTimers();
    const fetchMock = mockTokenFetch("abc", 3600);
    await getAccessToken();
    vi.advanceTimersByTime(3600 * 1000);
    await getAccessToken();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws when credentials are missing", async () => {
    mockTokenFetch();
    delete process.env.TWITCH_CLIENT_ID;
    await expect(getAccessToken()).rejects.toThrow(/TWITCH_CLIENT_ID/);
  });
});
