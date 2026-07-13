import { prisma } from "@/lib/db";
import type { UserItem } from "@/generated/prisma/client";
import type { AddItemInput } from "./types";

export async function addItem(
  userId: string,
  input: AddItemInput,
): Promise<UserItem> {
  const columns = toColumns(input);
  return prisma.userItem.upsert({
    where: {
      userId_itemType_catalogRefId: {
        userId,
        itemType: input.itemType,
        catalogRefId: input.catalogRefId,
      },
    },
    create: {
      userId,
      itemType: input.itemType,
      catalogRefId: input.catalogRefId,
      ...columns,
    },
    update: columns,
  });
}

function toColumns(input: AddItemInput) {
  const columns = {
    ownership: input.ownership,
    condition: input.condition ?? null,
    notes: input.notes ?? null,
    acquisitionPrice: input.acquisitionPrice ?? null,
    acquisitionDate: input.acquisitionDate ?? null,
    desiredMaxPrice:
      input.ownership === "wishlist" ? (input.desiredMaxPrice ?? null) : null,
    hasGame: null as boolean | null,
    hasBox: null as boolean | null,
    hasManual: null as boolean | null,
    hasConsole: null as boolean | null,
    hasController: null as boolean | null,
    hasCables: null as boolean | null,
  };

  if (input.itemType === "game") {
    columns.hasGame = input.components?.hasGame ?? null;
    columns.hasBox = input.components?.hasBox ?? null;
    columns.hasManual = input.components?.hasManual ?? null;
  } else {
    columns.hasConsole = input.components?.hasConsole ?? null;
    columns.hasController = input.components?.hasController ?? null;
    columns.hasCables = input.components?.hasCables ?? null;
    columns.hasBox = input.components?.hasBox ?? null;
    columns.hasManual = input.components?.hasManual ?? null;
  }

  return columns;
}
