# Flujo de trabajo con Git

Objetivo: máxima automatización. La integración con GitHub se hace vía **MCP de
GitHub**, no con pasos manuales. Cada cambio llega a `main` mediante PR revisado.

## Ramas

- **Una rama por feature.** Nunca trabajar directamente sobre `main`.
- Ramas **pequeñas y fácilmente revisables**: un cambio con un propósito. Si una
  rama crece demasiado para revisarse de un vistazo, dividirla.
- Nombres descriptivos por tipo y ámbito: `feat/igdb-client`,
  `feat/collection-completeness`, `fix/price-observation-dedup`,
  `chore/scaffold`.
- Rebozar/actualizar sobre `main` antes de abrir el PR.

## Commits

- Commits **con cabeza**: cada commit es un paso lógico coherente, no un volcado.
- Mensajes claros y entendibles, en imperativo. Estilo Conventional Commits:
  `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`.
- El asunto describe el qué; el cuerpo, el porqué cuando no es evidente.
- Nada de commits tipo "wip", "fixes", "cambios".

## Pull Requests

- Todo cambio entra a `main` por PR. `main` siempre revisable y en verde.
- PR pequeño, con descripción del qué y el porqué, y cómo probarlo.
- **Revisión por agente especializado.** Cada PR lo revisa un agente de revisión
  de código antes del merge (`/code-review`, o `code-reviewer` vía Agent).
- **Merge automático tras revisión exitosa.** Si la revisión del agente pasa sin
  hallazgos, mergear a `main` sin pedir confirmación adicional. No se requiere
  aprobación manual del usuario por cada PR.
- Si la revisión encuentra hallazgos, resolverlos y volver a revisar antes de
  mergear. Ver `superpowers:receiving-code-review` para tratar el feedback con
  rigor. No mergear con hallazgos abiertos.

## Automatización (MCP GitHub)

- Crear ramas, abrir PRs, comentar y mergear vía el **MCP de GitHub**, no a mano.
- El MCP se usa una vez el repositorio remoto esté establecido (ver abajo).
- El ciclo rama → PR → revisión por agente → merge se ejecuta de forma autónoma:
  el merge a `main` no requiere confirmación del usuario si la revisión pasa sin
  hallazgos (ver Pull Requests).

## Estado actual

- El repo **aún no está inicializado**. El scaffolding inicial se prepara en
  local sobre `main`.
- Cuando el scaffolding esté en `main`, el usuario **establece el repositorio
  remoto** en GitHub. A partir de ahí se trabaja con el flujo ramas → PR →
  revisión por agente → merge, automatizado vía MCP.
- No inicializar git ni hacer push sin petición explícita del usuario.
