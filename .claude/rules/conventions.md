# Convenciones

## Clean Code

- Nombres significativos; el nombre revela la intención.
- Funciones pequeñas, una responsabilidad.
- Sin abstracciones anticipadas (YAGNI). No generalizar para un solo caso.
- Sin comentarios obvios; el código se explica solo. Comentar solo el porqué no
  evidente.
- No añadir manejo de errores, validaciones, flags ni compatibilidad hacia atrás
  para escenarios que no pueden ocurrir.
- No introducir dependencias ni refactors más allá de lo pedido.

## TypeScript

- `strict` activado. Evitar `any`; preferir tipos explícitos en fronteras
  (API, servicios, datos externos).
- Tipar los datos de IGDB y de `PriceSource` en su subsistema; no propagar tipos
  crudos de terceros por toda la app.
- Preferir tipos derivados de Prisma para entidades de DB.

## Estructura

- Organización **por feature/dominio**, no por tipo técnico. Cada subsistema
  (`igdb`, `pricing`, `notifications`, `collection`, `catalog`) agrupa su
  servicio, tipos y acceso a datos.
- UI en su capa, sin lógica de negocio (ver `architecture.md`).
- Nombres de archivos y carpetas en inglés, coherentes con el ecosistema
  Next.js. Textos de interfaz en español.

## Datos

- Todo cambio de esquema vía migración Prisma. No editar la DB a mano.
- Secretos (Twitch/IGDB, eBay, DB) solo en variables de entorno del servidor.
  Nunca en el cliente ni commiteados.

## Testing

- Tests centrados en lógica de dominio: completitud, reglas de precio/alerta,
  mapeo de datos IGDB, contrato de `PriceSource`.
- Las fuentes externas se testean contra la interfaz con dobles; no golpear APIs
  reales en tests.
- No perseguir cobertura por cobertura; probar lo que tiene lógica real.
- La capa de acceso a datos se testea por integración contra Postgres. `npm test`
  requiere la DB levantada (`npm run db:up`); usa una base separada
  (`gamecolector_test`) que se crea y migra sola.

## Git

Ver `git-workflow.md`: rama por feature, commits con cabeza, todo a `main` por PR
revisado por agente, automatización vía MCP de GitHub. El repo aún no está
inicializado; no commitear ni hacer push sin petición explícita.
