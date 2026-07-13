const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const EXPIRY_MARGIN_SECONDS = 60;

interface CachedToken {
  value: string;
  expiresAt: number;
}

let cached: CachedToken | undefined;

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export async function getAccessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const params = new URLSearchParams({
    client_id: requireEnv("TWITCH_CLIENT_ID"),
    client_secret: requireEnv("TWITCH_CLIENT_SECRET"),
    grant_type: "client_credentials",
  });

  const response = await fetch(`${TOKEN_URL}?${params}`, { method: "POST" });
  if (!response.ok) {
    throw new Error(`Twitch token request failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cached = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - EXPIRY_MARGIN_SECONDS) * 1000,
  };
  return cached.value;
}

// Test-only: limpia la caché del token entre casos.
export function _resetTokenCache(): void {
  cached = undefined;
}
