# Arquitectura

## Regla central: dos mundos enlazados

- **Catálogo** = datos externos cacheados (IGDB + manuales). Compartido entre
  usuarios. Nunca contiene datos de posesión.
- **Colección** = datos del usuario. Siempre referencia catálogo por id, nunca
  duplica sus campos (nombre, imagen, etc. se leen del catálogo).

No mezclar ambos en una misma entidad. Un `Game` no tiene `hasBox`; eso vive en
`UserItem`.

## Subsistemas (boundaries)

Cada subsistema expone una interfaz y oculta su implementación. Un subsistema no
importa los internos de otro; se comunican por sus interfaces.

- **`igdb`** — obtención y caché de catálogo. El resto de la app consume
  catálogo desde la DB, no llama a IGDB directamente.
- **`pricing`** — `PriceSource` unifica todas las fuentes. El resto de la app no
  conoce eBay/Wallapop; solo la interfaz.
- **`notifications`** — consume observaciones de precio y reglas; no sabe de
  marketplaces concretos.

Regla: si añadir una fuente de precios obliga a tocar UI o notifications, el
boundary está mal.

## Capas

1. **DB / Prisma** — esquema y acceso a datos.
2. **Dominio / servicios** — lógica por subsistema (`igdb`, `pricing`,
   `notifications`, `collection`).
3. **API (route handlers / server actions)** — orquestan servicios.
4. **UI** — componentes; no contienen lógica de negocio ni llamadas externas.

Las llamadas a servicios externos (IGDB, eBay) ocurren solo en la capa de
dominio, nunca en componentes de UI.

## Qué NO acoplar

- UI ↔ servicios externos: la UI habla con la API/servicios propios.
- `pricing` ↔ fuentes concretas: solo a través de `PriceSource`.
- Catálogo ↔ posesión: entidades separadas.
- Trabajo en background (sync IGDB, sondeo de precios) desacoplado de peticiones
  de UI. Documentar como jobs; no bloquear renders con ello.

## Organización por feature

Estructura por dominio, no por tipo técnico. Cada subsistema agrupa su código
(servicio, tipos, acceso a datos). Ver `conventions.md`.
