import { isComplete } from "@/modules/collection";
import type { UserItem } from "@/generated/prisma/client";

export function ItemStatus({ item }: { item: UserItem | null }) {
  if (!item) {
    return (
      <span className="text-label-sm text-on-surface-variant">
        No en tu colección
      </span>
    );
  }
  if (item.ownership === "wishlist") {
    return <span className="text-label-sm text-error">En lista de deseos</span>;
  }
  const complete = isComplete(item);
  return (
    <span
      className={`text-label-sm ${complete ? "text-secondary" : "text-on-surface-variant"}`}
    >
      {complete ? "Completo" : "Incompleto"}
    </span>
  );
}
