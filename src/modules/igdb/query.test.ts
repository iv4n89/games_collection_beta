import { describe, expect, it } from "vitest";
import { escapeSearchTerm } from "./query";

describe("escapeSearchTerm", () => {
  it("escapes double quotes", () => {
    expect(escapeSearchTerm('a "b" c')).toBe('a \\"b\\" c');
  });

  it("escapes backslashes so a trailing backslash cannot break the query string", () => {
    expect(escapeSearchTerm("foo\\")).toBe("foo\\\\");
  });

  it("escapes backslashes before quotes", () => {
    expect(escapeSearchTerm('a\\"b')).toBe('a\\\\\\"b');
  });
});
