"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { addItem } from "@/modules/collection";

export async function addToCollection(gameId: string, formData: FormData) {
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

export async function addToWishlist(gameId: string) {
  const user = await requireUser();
  await addItem(user.id, {
    itemType: "game",
    catalogRefId: gameId,
    ownership: "wishlist",
  });
  revalidatePath(`/games/${gameId}`);
}
