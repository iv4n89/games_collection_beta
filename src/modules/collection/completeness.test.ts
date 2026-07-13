import { describe, expect, it } from "vitest";
import type { UserItem } from "@/generated/prisma/client";
import { isComplete } from "./completeness";

function item(partial: Partial<UserItem>): UserItem {
  return {
    hasGame: null,
    hasBox: null,
    hasManual: null,
    hasConsole: null,
    hasController: null,
    hasCables: null,
    hasAccessory: null,
    ...partial,
  } as UserItem;
}

describe("isComplete", () => {
  it("a game is complete with game, box and manual", () => {
    expect(
      isComplete(
        item({
          itemType: "game",
          hasGame: true,
          hasBox: true,
          hasManual: true,
        }),
      ),
    ).toBe(true);
  });

  it("a game is incomplete when a component is missing", () => {
    expect(
      isComplete(
        item({
          itemType: "game",
          hasGame: true,
          hasBox: true,
          hasManual: false,
        }),
      ),
    ).toBe(false);
  });

  it("a game with unset flags is incomplete", () => {
    expect(isComplete(item({ itemType: "game" }))).toBe(false);
  });

  it("a platform requires its five components", () => {
    expect(
      isComplete(
        item({
          itemType: "platform",
          hasConsole: true,
          hasController: true,
          hasCables: true,
          hasBox: true,
          hasManual: true,
        }),
      ),
    ).toBe(true);
    expect(
      isComplete(
        item({
          itemType: "platform",
          hasConsole: true,
          hasController: true,
          hasCables: true,
          hasBox: true,
          hasManual: null,
        }),
      ),
    ).toBe(false);
  });
});
