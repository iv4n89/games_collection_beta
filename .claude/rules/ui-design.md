# Diseño de UI

Objetivo: interfaz "premium dark" para catalogar colección, tomada del design
system QuestLog (generado en Stitch). Museo digital: densidad de contenido útil,
alto contraste, la portada del juego como foco visual. Ver los tokens en
`src/app/globals.css` (bloque `@theme` de Tailwind v4).

## Tema y paleta

- **Tema oscuro único.** Fondo navy (`background`/`surface` #0b1326). No hay tema
  claro; no se usan variantes `dark:`.
- **Acento primario violeta** (`primary` #d0bcff), usado con moderación: enlaces,
  estado activo, acción primaria.
- **Secundario menta** (`secondary` #4edea3) para estado "en colección" /
  completitud positiva.
- **Error/wishlist** en rojo (`error` #ffb4ab / `error-container`).
- Superficies por capas tonales: `surface-container-lowest` … `-highest`,
  diferenciadas por color de fondo y bordes sutiles (`border-white/5`), no por
  sombras pesadas salvo la `ambient-shadow` de las cards de nivel 1.

## Tipografía y espaciado

- Fuente **Inter** (cargada por CDN en `layout.tsx`). Jerarquía por tamaño y
  peso con los tokens `text-display-lg`, `text-headline-lg/md`, `text-body-lg/md`,
  `text-label-md/sm`.
- Espaciado con tokens: `base` (8), `stack-sm/md/lg` (12/24/48), `grid-gutter`
  (24), `container-padding-mobile/desktop` (20/40). Usar estos tokens, no
  valores sueltos.

## Iconos

- **Material Symbols Outlined** (icon-font por CDN). Uso:
  `<span className="material-symbols-outlined">nombre</span>`. Estados activos
  con `style={{ fontVariationSettings: "'FILL' 1" }}`. Iconos decorativos con
  `aria-hidden="true"`.
- Los iconos comunican navegación y estado; no son decoración gratuita.

## Layout

- **App shell** global (`layout.tsx`): sidebar fija a la izquierda (`w-64`,
  oculta en móvil), topbar fija con `backdrop-blur`, footer mínimo. El contenido
  vive en `main` con `md:ml-64` y padding por tokens.
- Colección **por consola**: cada plataforma es un módulo navegable
  (`/platforms/[id]`).

## Patrones

- **Platform-card**: tarjeta `surface-container-low`, `rounded-xl`, círculo con
  icono + nombre.
- **Game-card**: aspect 2:3, portada a sangre con gradiente inferior y badge de
  estado (verde `check`/`check_circle` = poseído; rojo `favorite` = wishlist).
  Placeholder con el título cuando falta portada.
- **Estado de completitud**: derivado de los flags de `data-model.md`, mostrado
  compacto (`ItemStatus`, colores con significado).
- Estados vacíos con texto útil y una acción, sin ilustraciones.

## Componentes

- Componentes propios, pequeños y reutilizables; sin librería de UI pesada.
- Accesibilidad básica: contraste suficiente, foco visible (`focus-visible:ring`
  con `primary`), `alt` en imágenes, controles navegables por teclado.
- La UI no contiene lógica de negocio ni llamadas externas (ver
  `architecture.md`).

## Tokens

- Todos los tokens (colores, spacing, tipografía) viven en el bloque `@theme` de
  `src/app/globals.css`, traducidos del design system QuestLog de Stitch. Añadir
  o cambiar un token allí, no con valores arbitrarios en las clases.
