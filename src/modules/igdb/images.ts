const DEFAULT_SIZE = "t_cover_big";

// IGDB devuelve urls como //images.igdb.com/.../t_thumb/abc.jpg
export function resolveImageUrl(
  url: string | undefined,
  size: string = DEFAULT_SIZE,
): string | undefined {
  if (!url) {
    return undefined;
  }
  const withProtocol = url.startsWith("//") ? `https:${url}` : url;
  return withProtocol.replace("t_thumb", size);
}
