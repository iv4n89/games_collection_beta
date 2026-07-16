"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { addItem } from "@/modules/collection";
import type { Ownership } from "@/generated/prisma/client";

export async function setGameOwnership(gameId: string, ownership: Ownership) {
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
  revalidatePath(`/games/${gameId}`);
}

export async function updateGameComponents(gameId: string, formData: FormData) {
  const user = await requireUser();
  await addItem(user.id, {
    itemType: "game",
    catalogRefId: gameId,
    ownership: "owned",
    components: {
      hasGame: formData.get("hasGame") === "on",
      hasBox: formData.get("hasBox") === "on",
      hasManual: formData.get("hasManual") === "on",
    },
  });
  revalidatePath(`/games/${gameId}`);
}
