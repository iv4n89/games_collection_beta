import { getAccessToken, requireEnv } from "./token";

const IGDB_BASE = "https://api.igdb.com/v4";
const MIN_REQUEST_INTERVAL_MS = 250; // IGDB permite 4 req/s

// Serializa las peticiones y las espacia para respetar el rate limit.
let pending: Promise<unknown> = Promise.resolve();
let lastRequestAt = 0;

async function throttle(): Promise<void> {
  const wait = MIN_REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt);
  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
  lastRequestAt = Date.now();
}

export async function igdbQuery<T>(endpoint: string, body: string): Promise<T> {
  const run = pending.then(async () => {
    await throttle();
    const token = await getAccessToken();
    const response = await fetch(`${IGDB_BASE}/${endpoint}`, {
      method: "POST",
      headers: {
        "Client-ID": requireEnv("TWITCH_CLIENT_ID"),
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body,
    });
    if (!response.ok) {
      throw new Error(`IGDB ${endpoint} request failed: ${response.status}`);
    }
    return (await response.json()) as T;
  });

  pending = run.catch(() => undefined);
  return run;
}
