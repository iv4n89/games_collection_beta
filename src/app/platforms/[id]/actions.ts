"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { addItem } from "@/modules/collection";
import type { Ownership } from "@/generated/prisma/client";

export async function addGameToCollection(
  platformId: string,
  gameId: string,
  ownership: Ownership,
) {
  const user = await requireUser();
  await addItem(user.id, {
    itemType: "game",
    catalogRefId: gameId,
    ownership,
    components:
      ownership === "owned"
        ? { hasGame: true, hasBox: true, hasManual: true }
        : undefined,
  });
  revalidatePath(`/platforms/${platformId}`);
}

export async function setConsoleOwnership(
  platformId: string,
  ownership: Ownership,
) {
  const user = await requireUser();
  await addItem(user.id, {
    itemType: "platform",
    catalogRefId: platformId,
    ownership,
    components:
      ownership === "owned"
        ? {
            hasConsole: true,
            hasController: true,
            hasCables: true,
            hasBox: true,
            hasManual: true,
          }
        : undefined,
  });
  revalidatePath(`/platforms/${platformId}`);
}
