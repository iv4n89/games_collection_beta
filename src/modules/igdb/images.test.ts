import { describe, expect, it } from "vitest";
import { resolveImageUrl } from "./images";

describe("resolveImageUrl", () => {
  it("prefixes protocol-relative urls with https and applies the default size", () => {
    expect(
      resolveImageUrl("//images.igdb.com/igdb/image/upload/t_thumb/abc.jpg"),
    ).toBe("https://images.igdb.com/igdb/image/upload/t_cover_big/abc.jpg");
  });

  it("replaces the size token with the requested size", () => {
    expect(
      resolveImageUrl(
        "https://images.igdb.com/igdb/image/upload/t_thumb/abc.jpg",
        "t_logo_med",
      ),
    ).toBe("https://images.igdb.com/igdb/image/upload/t_logo_med/abc.jpg");
  });

  it("returns undefined when there is no url", () => {
    expect(resolveImageUrl(undefined)).toBeUndefined();
  });
});
