# Modelo de datos

## Catálogo (compartido, cacheado)

- **`Platform`**: `igdbId?`, `name`, `slug`, `generation?`, `imageUrl?`,
  `source`.
- **`Game`**: `igdbId?`, `name`, `slug`, `platformId`, `coverUrl?`,
  `releaseDate?`, `summary?`, `source`.
- **`Accessory`**: `name`, `platformId?`, `imageUrl?`, `source` (normalmente
  `manual`; IGDB no cubre accesorios).
- **`SpecialEdition`**: `baseType` (`game|platform|accessory`), `baseId`,
  `name`, `imageUrl?`, `notes?`.

`source` distingue origen: `igdb` o `manual`. Los ítems `manual` no tienen
`igdbId`.

## Colección (por usuario)

- **`UserItem`**:
  - `userId`
  - `itemType`: `game | platform | accessory | special_edition`
  - `catalogRefType`, `catalogRefId`: puntero al ítem de catálogo
  - `ownership`: `owned | wishlist`
  - flags de completitud (según `itemType`, ver abajo)
  - `condition?`, `notes?`, `acquisitionPrice?`, `acquisitionDate?`
  - `desiredMaxPrice?`: solo para `wishlist`

La **wishlist es un estado** (`ownership = wishlist`), no una tabla aparte. Pasar
de deseado a poseído = cambiar el estado, no mover de tabla.

## Completitud por componentes

Flags booleanos, no un enum plano. "Completo" se deriva de tener todos los flags
del tipo. Permite cualquier combinación.

- **Juego**: `hasGame`, `hasBox`, `hasManual`.
- **Consola**: `hasConsole`, `hasController`, `hasCables`, `hasBox`, `hasManual`.
- **Accesorio**: `hasAccessory`, `hasBox`.

Reglas:

- Los flags aplicables dependen de `itemType`. No guardar flags irrelevantes
  para el tipo.
- No derivar ni almacenar un enum de estado ("loose", "CIB"); calcularlo en
  presentación a partir de los flags.
- Las ediciones especiales usan los flags de su `baseType`.

## Precios (histórico)

- **`PriceObservation`**: por ítem de wishlist. `userItemId`, `source`, `price`,
  `currency`, `url`, `condition`, `availability`, `seenAt`.
- **`PriceAlertRule`**: derivada del `UserItem` de wishlist (umbral =
  `desiredMaxPrice`, o vuelta a disponible).

## Principios

- El catálogo nunca guarda datos de posesión; `UserItem` nunca duplica campos de
  catálogo (nombre, imagen se leen por referencia).
- Migraciones vía Prisma. No editar la DB a mano.
