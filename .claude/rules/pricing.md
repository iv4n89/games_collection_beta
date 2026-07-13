# Seguimiento de precios

## Abstracción `PriceSource`

Todas las fuentes (eBay, Wallapop, subastas, tiendas ES) implementan la misma
interfaz. El resto de la app no conoce fuentes concretas.

```
PriceSource.search(query) -> Listing[]
Listing = { price, currency, url, condition, availability, source, seenAt }
```

Regla: añadir una fuente = implementar `PriceSource`. No debe requerir cambios
en UI, notifications ni en el modelo de datos.

## Estado de las fuentes

- **eBay** — API oficial (Browse API). Primera y única implementación real por
  ahora. Auth por credenciales de app en variables de entorno del servidor.
- **Wallapop, subastas, tiendas ES** — **fases posteriores**. Estas fuentes no
  tienen API oficial; requerirán scraping, que es frágil (anti-bot, cambios de
  HTML) y de zona legal gris. No implementarlas hasta que tengan su propio spec.
  Documentar la interfaz ahora; no el scraper.

No escribir scrapers especulativos. Primero estabilizar `PriceSource` con eBay.

## Observaciones

- Cada sondeo produce `PriceObservation` por ítem de wishlist (ver
  `data-model.md`).
- El sondeo es un **job en background**, desacoplado de las peticiones de UI.
- No sondear en cada carga de página; respetar límites de las fuentes.

## Notificaciones (enlace)

- Las observaciones nuevas se evalúan contra las `PriceAlertRule` derivadas de la
  wishlist (umbral de precio o vuelta a disponible).
- La entrega la maneja el subsistema `notifications`; `pricing` solo produce
  observaciones. Ver `architecture.md`.
