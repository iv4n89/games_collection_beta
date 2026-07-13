@AGENTS.md

# gameColector

Webapp de gestión de colección de videojuegos retro. Enlaza el catálogo de IGDB
(juegos y consolas) con los datos propios del usuario: qué posee y con qué grado
de completitud, qué desea, y a qué precio lo encuentra en marketplaces.

## Stack

- **Next.js** (App Router) + **TypeScript**.
- **Postgres** vía **Prisma**.
- **Auth.js** — multiusuario con cuentas (provider GitHub OAuth).
- **Tailwind** + componentes propios (sin librería de UI pesada).

## Arquitectura

Dos mundos que se enlazan:

- **Catálogo**: caché local de datos externos (`Platform`, `Game`, `Accessory`,
  `SpecialEdition`). Juegos y consolas provienen de IGDB; accesorios y ediciones
  no presentes en IGDB se registran manualmente.
- **Colección del usuario**: `UserItem` referencia un ítem de catálogo y añade
  posesión (poseído / wishlist) y completitud por componentes.

Subsistemas aislados, cada uno con su interfaz:

- `igdb` — cliente + sync/caché (auth Twitch OAuth).
- `catalog` — persistencia cache-first del catálogo sobre `igdb`.
- `pricing` — abstracción `PriceSource`; eBay (API oficial) primero.
- `notifications` — reglas de precio → entrega (email primero).

La UI agrupa la colección **por consola**: cada plataforma es un módulo de vista.

## Comandos

- `npm run dev` — servidor de desarrollo.
- `npm run build` / `npm start` — build y arranque de producción.
- `npm run lint` / `npm run typecheck` — lint y comprobación de tipos.
- `npm test` — tests (requiere la DB levantada: `npm run db:up`).
- `npm run db:up` — Postgres local vía docker-compose.
- `npm run db:migrate` — migraciones de base de datos.

## Reglas del proyecto

Las convenciones detalladas viven en `.claude/rules/`. Consúltalas antes de
tocar el área correspondiente:

- **architecture.md** — boundaries de subsistemas, capas, qué NO acoplar.
- **data-model.md** — catálogo vs colección, completitud, wishlist.
- **igdb-integration.md** — uso de IGDB, caché, rate limits, auth.
- **auth.md** — Auth.js, provider GitHub, sesión por DB, envs.
- **pricing.md** — abstracción `PriceSource`, oficial vs scraping futuro.
- **ui-design.md** — minimalismo, evitar estética "IA", tokens y patrones.
- **conventions.md** — naming, Clean Code, estructura, TypeScript, testing.
- **git-workflow.md** — ramas por feature, commits, PRs, revisión por agente, MCP.

## Principios

- Clean Code: nombres significativos, funciones pequeñas, sin abstracciones
  anticipadas, sin comentarios obvios.
- No añadir manejo de errores, validaciones ni flags para escenarios que no
  pueden ocurrir.
- No introducir dependencias, refactors ni features más allá de lo pedido.
- Respuestas e interfaz en español.
