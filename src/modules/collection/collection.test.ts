import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { addItem } from "./add";
import { getPlatformCollection, getUserPlatforms } from "./list";

function createUser(name: string) {
  return prisma.user.create({ data: { name } });
}

function createPlatform(igdbId: number, name: string, slug: string) {
  return prisma.platform.create({
    data: { igdbId, name, slug, source: "igdb" },
  });
}

function createGame(
  platformId: string,
  igdbId: number,
  name: string,
  slug: string,
) {
  return prisma.game.create({
    data: { igdbId, name, slug, platformId, source: "igdb" },
  });
}

beforeEach(async () => {
  await prisma.$executeRawUnsafe(
    'TRUNCATE "UserItem", "Game", "Platform", "User" RESTART IDENTITY CASCADE',
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("addItem", () => {
  it("creates a game item with its completeness flags and ownership", async () => {
    const user = await createUser("ivan");
    const platform = await createPlatform(41, "Wii U", "wiiu");
    const game = await createGame(
      platform.id,
      7346,
      "Breath of the Wild",
      "botw",
    );

    const created = await addItem(user.id, {
      itemType: "game",
      catalogRefId: game.id,
      ownership: "owned",
      components: { hasGame: true, hasBox: true, hasManual: false },
    });

    expect(created).toMatchObject({
      userId: user.id,
      itemType: "game",
      catalogRefId: game.id,
      ownership: "owned",
      hasGame: true,
      hasBox: true,
      hasManual: false,
    });
  });

  it("stores console components for a platform item", async () => {
    const user = await createUser("ivan");
    const platform = await createPlatform(41, "Wii U", "wiiu");

    const created = await addItem(user.id, {
      itemType: "platform",
      catalogRefId: platform.id,
      ownership: "owned",
      components: {
        hasConsole: true,
        hasController: true,
        hasCables: false,
        hasBox: false,
        hasManual: false,
      },
    });

    expect(created).toMatchObject({
      itemType: "platform",
      hasConsole: true,
      hasController: true,
      hasCables: false,
    });
  });

  it("upserts on the same catalog item: moving wishlist to owned clears the desired price", async () => {
    const user = await createUser("ivan");
    const platform = await createPlatform(41, "Wii U", "wiiu");
    const game = await createGame(
      platform.id,
      7346,
      "Breath of the Wild",
      "botw",
    );

    await addItem(user.id, {
      itemType: "game",
      catalogRefId: game.id,
      ownership: "wishlist",
      desiredMaxPrice: 50,
    });
    await addItem(user.id, {
      itemType: "game",
      catalogRefId: game.id,
      ownership: "owned",
      components: { hasGame: true },
    });

    const items = await prisma.userItem.findMany({
      where: { userId: user.id },
    });
    expect(items).toHaveLength(1);
    expect(items[0].ownership).toBe("owned");
    expect(items[0].desiredMaxPrice).toBeNull();
    expect(items[0].hasGame).toBe(true);
  });
});

describe("getPlatformCollection", () => {
  it("returns the console and games of the platform, scoped to the user", async () => {
    const user = await createUser("ivan");
    const other = await createUser("otro");
    const wiiu = await createPlatform(41, "Wii U", "wiiu");
    const nswitch = await createPlatform(130, "Switch", "switch");
    const botw = await createGame(wiiu.id, 7346, "Breath of the Wild", "botw");
    const splatoon = await createGame(wiiu.id, 100, "Splatoon", "splatoon");
    const odyssey = await createGame(nswitch.id, 200, "Odyssey", "odyssey");

    await addItem(user.id, {
      itemType: "platform",
      catalogRefId: wiiu.id,
      ownership: "owned",
      components: { hasConsole: true },
    });
    await addItem(user.id, {
      itemType: "game",
      catalogRefId: botw.id,
      ownership: "owned",
      components: { hasGame: true },
    });
    await addItem(user.id, {
      itemType: "game",
      catalogRefId: splatoon.id,
      ownership: "wishlist",
    });
    await addItem(user.id, {
      itemType: "game",
      catalogRefId: odyssey.id,
      ownership: "owned",
    });
    await addItem(other.id, {
      itemType: "game",
      catalogRefId: botw.id,
      ownership: "owned",
    });

    const result = await getPlatformCollection(user.id, wiiu.id);

    expect(result.console?.catalogRefId).toBe(wiiu.id);
    expect(result.games).toHaveLength(2);
    expect(result.games.map((entry) => entry.game.name)).toEqual([
      "Breath of the Wild",
      "Splatoon",
    ]);
    expect(result.games.map((entry) => entry.item.ownership)).toEqual([
      "owned",
      "wishlist",
    ]);
  });

  it("returns a null console when the user does not own the platform", async () => {
    const user = await createUser("ivan");
    const wiiu = await createPlatform(41, "Wii U", "wiiu");

    const result = await getPlatformCollection(user.id, wiiu.id);

    expect(result.console).toBeNull();
    expect(result.games).toEqual([]);
  });
});

describe("getUserPlatforms", () => {
  it("returns the user's console items enriched, excluding games and other users", async () => {
    const user = await createUser("ivan");
    const other = await createUser("otro");
    const wiiu = await createPlatform(41, "Wii U", "wiiu");
    const nswitch = await createPlatform(130, "Switch", "switch");
    const game = await createGame(wiiu.id, 7346, "Breath of the Wild", "botw");

    await addItem(user.id, {
      itemType: "platform",
      catalogRefId: nswitch.id,
      ownership: "owned",
      components: { hasConsole: true },
    });
    await addItem(user.id, {
      itemType: "platform",
      catalogRefId: wiiu.id,
      ownership: "wishlist",
    });
    await addItem(user.id, {
      itemType: "game",
      catalogRefId: game.id,
      ownership: "owned",
    });
    await addItem(other.id, {
      itemType: "platform",
      catalogRefId: wiiu.id,
      ownership: "owned",
    });

    const result = await getUserPlatforms(user.id);

    expect(result.map((entry) => entry.platform.name)).toEqual([
      "Switch",
      "Wii U",
    ]);
    expect(result.map((entry) => entry.item.ownership)).toEqual([
      "owned",
      "wishlist",
    ]);
  });
});
