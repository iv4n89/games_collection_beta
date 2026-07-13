import { isComplete } from "@/modules/collection";
import type { UserItem } from "@/generated/prisma/client";

export function ItemStatus({ item }: { item: UserItem | null }) {
  if (!item) {
    return <span className="text-xs text-stone-400">No en tu colección</span>;
  }
  if (item.ownership === "wishlist") {
    return (
      <span className="text-xs font-medium text-amber-700">En wishlist</span>
    );
  }
  const complete = isComplete(item);
  return (
    <span
      className={`text-xs font-medium ${complete ? "text-emerald-700" : "text-stone-500"}`}
    >
      {complete ? "Completo" : "Incompleto"}
    </span>
  );
}
