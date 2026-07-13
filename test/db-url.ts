// Base de datos dedicada a los tests de integración, separada de la de
// desarrollo para no pisar datos. Requiere el contenedor de `docker-compose`
// levantado (`npm run db:up`).
export const TEST_DATABASE_URL =
  "postgresql://gamecolector:gamecolector@localhost:5432/gamecolector_test";

export const ADMIN_DATABASE_URL =
  "postgresql://gamecolector:gamecolector@localhost:5432/gamecolector";
