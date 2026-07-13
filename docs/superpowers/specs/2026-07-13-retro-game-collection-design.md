# Retro Game Collection — Diseño

Fecha: 2026-07-13
Estado: aprobado (base para docs + harness)

## Propósito

Webapp de gestión de colección de videojuegos retro. Enlaza un catálogo
externo (IGDB) con los datos propios del usuario: qué posee, en qué grado de
completitud, y qué desea. Incluye seguimiento de precios en marketplaces y
notificaciones cuando un deseado baja de precio o vuelve a estar disponible.

## Decisiones fundamentales

- **Stack:** Next.js (App Router) + TypeScript + Postgres vía Prisma.
- **Auth:** Auth.js, multiusuario con cuentas. Colección y wishlist por usuario.
- **UI:** Tailwind + componentes propios. Minimalista, sin estética "IA".
- **Precios:** abstracción `PriceSource`. Implementación inicial eBay (API
  oficial). Wallapop, subastas y tiendas ES quedan documentados como fases
  posteriores, tras estabilizar la interfaz.
- **Alcance de esta sesión:** solo documentación y harness (`CLAUDE.md`,
  `.claude/rules`). Sin código de aplicación todavía.

## Arquitectura

Dos mundos que se enlazan:

1. **Catálogo** (caché local de datos externos): `Platform`, `Game`,
   `Accessory` y `SpecialEdition` (variante enlazable a cualquiera de los tres).
   Origen IGDB para juegos y consolas; los accesorios y ediciones no presentes
   en IGDB se registran manualmente (campo `source`).
2. **Colección del usuario**: `UserItem` referencia un ítem de catálogo y añade
   estado de posesión (poseído / wishlist) y flags de completitud por
   componentes. La wishlist es un estado de `UserItem`, no una tabla aparte.

### Subsistemas (boundaries aislados)

Cada uno expone una interfaz y podrá tener su propio spec de implementación:

- **`igdb`**: cliente + sincronización/caché. Auth vía Twitch OAuth.
- **`pricing`**: abstracción `PriceSource`; observaciones de precio por ítem de
  wishlist. Implementación eBay primero.
- **`notifications`**: reglas de precio (umbral / vuelta a disponible) →
  entrega. Canal inicial email.

### Módulos por consola

La navegación agrupa la colección por plataforma. Cada plataforma es un
"módulo" de UI (una vista/agrupación), no una entidad técnica separada.

## Modelo de datos (núcleo)

### Catálogo

- `Platform`: `igdbId?`, `name`, `slug`, `generation?`, `imageUrl?`, `source`.
- `Game`: `igdbId?`, `name`, `slug`, `platformId`, `coverUrl?`, `releaseDate?`,
  `summary?`, `source`.
- `Accessory`: `name`, `platformId?`, `imageUrl?`, `source` (normalmente manual).
- `SpecialEdition`: `baseType` (game|platform|accessory), `baseId`, `name`,
  `imageUrl?`, `notes?`.

### Colección

- `UserItem`: `userId`, `itemType` (game|platform|accessory|special_edition),
  `catalogRefType`, `catalogRefId`, `ownership` (owned|wishlist), flags de
  componentes (según tipo), `condition?`, `notes?`, `acquisitionPrice?`,
  `acquisitionDate?`, `desiredMaxPrice?` (solo wishlist).

### Completitud por componentes (flags, no enum plano)

- **Juego**: `hasGame`, `hasBox`, `hasManual`.
- **Consola**: `hasConsole`, `hasController`, `hasCables`, `hasBox`, `hasManual`.
- **Accesorio**: `hasAccessory`, `hasBox`.

"Completo" se deriva de tener todos los flags del tipo. Se modela como flags
para permitir cualquier combinación (p. ej. solo caja, o juego + manual sin caja).

## Pricing

- `PriceSource`: interfaz común. `search(query) -> Listing[]` con `price`,
  `currency`, `url`, `condition`, `source`, `seenAt`.
- `PriceObservation`: histórico de precios por ítem de wishlist.
- `PriceAlertRule`: derivada del `desiredMaxPrice`/disponibilidad del `UserItem`.
- Implementación inicial: eBay Browse API (oficial). Resto: fases posteriores.

## Notifications

- Regla evaluada contra nuevas `PriceObservation`: umbral de precio o vuelta a
  disponibilidad.
- Entrega inicial: email. Web push documentado como posterior.

## Harness a crear

```
CLAUDE.md
.claude/rules/
  architecture.md
  data-model.md
  igdb-integration.md
  pricing.md
  ui-design.md
  conventions.md
```

## Fuera de alcance ahora

- Scaffold del proyecto (framework, DB, lint) — sesión posterior.
- Scrapers de Wallapop / tiendas ES — tras estabilizar `PriceSource`.
- Web push — tras el canal email.
