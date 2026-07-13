"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { addItem } from "@/modules/collection";

export async function addConsoleToCollection(platformId: string) {
  const user = await requireUser();
  await addItem(user.id, {
    itemType: "platform",
    catalogRefId: platformId,
    ownership: "owned",
    components: {
      hasConsole: true,
      hasController: true,
      hasCables: true,
      hasBox: true,
      hasManual: true,
    },
  });
  revalidatePath("/");
}
