import type { Ownership } from "@/generated/prisma/client";

export interface GameComponents {
  hasGame?: boolean;
  hasBox?: boolean;
  hasManual?: boolean;
}

export interface PlatformComponents {
  hasConsole?: boolean;
  hasController?: boolean;
  hasCables?: boolean;
  hasBox?: boolean;
  hasManual?: boolean;
}

interface CommonMeta {
  ownership: Ownership;
  condition?: string;
  notes?: string;
  acquisitionPrice?: number;
  acquisitionDate?: Date;
  // Solo se guarda cuando ownership es "wishlist".
  desiredMaxPrice?: number;
}

export type AddItemInput =
  | ({
      itemType: "game";
      catalogRefId: string;
      components?: GameComponents;
    } & CommonMeta)
  | ({
      itemType: "platform";
      catalogRefId: string;
      components?: PlatformComponents;
    } & CommonMeta);
