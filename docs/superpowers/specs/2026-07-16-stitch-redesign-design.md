# Rediseño UI: adopción del design system de Stitch (QuestLog)

## Objetivo

Adoptar el diseño generado en Stitch (proyecto "Video Game Collection Hub",
tema QuestLog) como el diseño oficial de gameColector. Se reestila la UI
existente pantalla por pantalla hasta reproducir ese lenguaje visual, sin
inventar features nuevas.

## Decisiones de partida

1. **Reglas de UI**: se reescribe `.claude/rules/ui-design.md` documentando el
   nuevo design system (dark, acento violeta, tokens tipo Material) como norma.
   El anterior (tema claro stone, prohibición de violeta/gradientes/iconos)
   queda derogado.
2. **Alcance**: solo se reestila lo que ya funciona con datos reales (consolas,
   detalle de plataforma, añadir vía búsqueda, estado de posesión). No se
   construyen secciones sin backend (carrusel de destacados, precios,
   Explorador, Detalle de Juego, Lista de Deseos como página).
3. **Fuentes por CDN**: Inter y Material Symbols Outlined se cargan por `<link>`
   a `fonts.googleapis.com` (igual que el HTML de Stitch). Tailwind **no** se
   carga por CDN: se sigue compilando con Tailwind v4 del proyecto.

## Adaptación técnica clave: tokens Tailwind v4

El HTML de Stitch usa Tailwind v3 por CDN con `tailwind.config` inline. El
proyecto usa Tailwind v4 (`@import "tailwindcss"` en `globals.css`). Se traduce
la config de Stitch al bloque `@theme` de v4.

- **Colores** (`--color-*`): paleta completa QuestLog. Claves principales:
  - `--color-background: #0b1326`, `--color-surface: #0b1326`
  - `--color-surface-dim: #0b1326`, `--color-surface-container-lowest: #060e20`
  - `--color-surface-container-low: #131b2e`, `--color-surface-container: #171f33`
  - `--color-surface-container-high: #222a3d`, `--color-surface-container-highest: #2d3449`
  - `--color-surface-variant: #2d3449`, `--color-surface-bright: #31394d`
  - `--color-on-surface: #dae2fd`, `--color-on-surface-variant: #cbc3d7`
  - `--color-primary: #d0bcff`, `--color-on-primary: #3c0091`,
    `--color-primary-container: #a078ff`, `--color-primary-fixed: #e9ddff`
  - `--color-secondary: #4edea3`, `--color-on-secondary: #003824`,
    `--color-secondary-container: #00a572`, `--color-secondary-fixed-dim: #4edea3`
  - `--color-tertiary: #ffb869`
  - `--color-error: #ffb4ab`, `--color-error-container: #93000a`
  - `--color-outline: #958ea0`, `--color-outline-variant: #494454`
  (Resto de tokens `on-*`/`*-fixed` según el design system de Stitch; se copian
  todos para fidelidad.)
- **Spacing** (`--spacing-*`): `grid-gutter: 24px`, `stack-lg: 48px`,
  `stack-md: 24px`, `stack-sm: 12px`, `base: 8px`,
  `container-padding-desktop: 40px`, `container-padding-mobile: 20px`.
  Generan `px-grid-gutter`, `gap-stack-sm`, `py-stack-md`, etc.
- **Tipografía** (`--text-*` con line-height/letter-spacing/weight):
  `display-lg` (48/56, -0.02em, 700), `headline-lg` (32/40, -0.01em, 600),
  `headline-md` (24/32, 600), `body-lg` (18/28, 400), `body-md` (16/24, 400),
  `label-md` (14/20, 0.05em, 600), `label-sm` (12/16, 500).
  Fuente base: Inter (se fija en `body`). Las clases `font-headline-md` etc. de
  Stitch (todas Inter) se omiten al portar; basta la clase `text-*` para tamaño.
- **Radios**: `rounded-lg` (0.5rem) y `rounded-xl` (0.75rem) coinciden con los
  valores por defecto de Tailwind; no se sobreescriben.
- **Tema oscuro por defecto**: la paleta es oscura de base; no se usan variantes
  `dark:`. Al portar el markup de Stitch se eliminan los prefijos `dark:` y la
  clase `dark` del `<html>`.

Utilidad auxiliar `ambient-shadow` (`box-shadow: 0 10px 30px rgba(0,0,0,.5)`)
para las cards de nivel 1, definida en `globals.css`.

## Arquitectura

Se mantienen intactas las capas de dominio, server actions y data fetching. Solo
cambia la capa de presentación (markup + clases). La UI sigue sin lógica de
negocio.

### App shell (global)

Nuevo shell en `layout.tsx` que envuelve `children`: `Sidebar` + `TopBar` +
`Footer`. Sustituye a `SiteHeader`.

- **Sidebar** (`src/components/sidebar.tsx`): fija a la izquierda (oculta en
  móvil). Marca "gameColector" + subtítulo. Un único item de navegación real,
  **Inicio** (`/`), con estado activo. Al fondo, bloque de usuario (nombre +
  botón **Salir** vía server action `signOut`). Cuando no hay sesión, muestra
  **Entrar con GitHub** (server action `signIn("github")`).
  Los items de Stitch sin ruta real (Explorador, Mi Colección, Lista de Deseos,
  Ajustes) se omiten.
- **TopBar** (`src/components/top-bar.tsx`): barra superior fija con blur. Marca
  en móvil. Se omiten los botones fake (notificaciones, analytics). Avatar de
  usuario si hay sesión.
- **Footer** mínimo: marca gameColector. Sin links legales de relleno ni el
  copy "powered by eBay APIs".
- **Nav inferior móvil**: opcional; con un solo destino real (Inicio) aporta
  poco. Se omite salvo que en implementación resulte necesario para el layout
  móvil.

`SiteHeader` se elimina una vez el shell lo cubre.

### Pantalla: Inicio (`src/app/page.tsx`)

- Con sesión: título "Tus consolas" + **grid de platform-cards**
  (`src/components/platform-card.tsx`): tarjeta `bg-surface-container-low`
  redondeada (`rounded-xl`), círculo con icono de plataforma, nombre y
  generación. Enlaza a `/platforms/[id]`.
- Estado vacío: texto útil + acción (buscar consola), sin ilustración.
- Sección "Añadir consola": `SearchForm` restilado (input redondeado
  `rounded-full` con icono de lupa). Lista de resultados con botón "Añadir".
- Sin sesión: mensaje + botón "Entrar con GitHub", dentro del shell.
- Sin carrusel de "Destacados" (data falsa, fuera de alcance).

### Pantalla: Detalle de plataforma (`src/app/platforms/[id]/page.tsx`)

- **Cabecera hero**: si `platform.imageUrl` existe, imagen de fondo con
  gradiente `from-surface-container-lowest`; si no, cabecera plana
  `bg-surface-container-low`. Muestra nombre (`text-display-lg`), chip de tipo
  (si hay dato), estado de la consola (`ItemStatus`) y botones **Tengo/Deseo**.
- **Grid de juegos** (`src/components/game-card.tsx`): card aspect-2/3 con
  portada (`game.coverUrl`; placeholder `bg-surface-container` con el título si
  falta). **Badge de estado** arriba a la derecha: poseído = `check` sobre
  `secondary-container`; wishlist = `favorite` sobre `error-container`; no
  poseído = sin badge. Título y subtítulo (desarrollador/año si disponible)
  sobre gradiente inferior. Mantiene botones explícitos **Tengo/Deseo**
  restilados (no el "+" al hover del mockup).
- Estado vacío de juegos: texto útil.
- Sección "Añadir juegos": `SearchForm` restilado + resultados, marcando los ya
  presentes en la colección.
- Sin tabs Accesorios/Ediciones de Consola (no implementadas).

### Componentes reestilados

- `ItemStatus`: mantiene la semántica (wishlist / completo / incompleto / no en
  colección) con los colores del nuevo palette (secondary/error/on-surface-variant).
- `SearchForm`: input redondeado con icono de lupa y foco `ring-primary`.

## Fuentes e iconos

En `layout.tsx`, dentro del `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet"/>
```

Iconos con `<span class="material-symbols-outlined">nombre</span>`. `FILL` se
controla con `style="font-variation-settings: 'FILL' 1"` en estados activos.

Nota: `AGENTS.md` avisa de que esta versión de Next tiene breaking changes.
Antes de tocar carga de fuentes / `<head>` en `layout.tsx`, consultar
`node_modules/next/dist/docs/`.

## Pruebas y verificación

- No se añaden tests (cambios de UI; el proyecto testea lógica de dominio, que
  no cambia).
- Verificación: `npm run lint`, `npm run typecheck`, `npm run build`, y revisión
  visual con la app levantada (`npm run dev`) comparando contra las capturas de
  Stitch: Inicio y Detalle de plataforma (NES).

## Fuera de alcance

- Pantallas Explorador de Módulos y Detalle de Juego de Stitch.
- Carrusel de destacados, seguimiento de precios en UI, página de Lista de
  Deseos, tabs de Accesorios/Ediciones.
- Renombrar la app a "QuestLog" (se mantiene "gameColector").
```
