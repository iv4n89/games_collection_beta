import type { ItemType, UserItem } from "@/generated/prisma/client";

const COMPONENTS_BY_TYPE: Record<ItemType, (keyof UserItem)[]> = {
  game: ["hasGame", "hasBox", "hasManual"],
  platform: ["hasConsole", "hasController", "hasCables", "hasBox", "hasManual"],
  accessory: ["hasAccessory", "hasBox"],
  special_edition: [],
};

// "Completo" = tener todos los componentes de su tipo. Se calcula en
// presentación a partir de los flags; no se almacena (ver data-model.md).
export function isComplete(item: UserItem): boolean {
  const components = COMPONENTS_BY_TYPE[item.itemType];
  return (
    components.length > 0 && components.every((flag) => item[flag] === true)
  );
}
