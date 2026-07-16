# Rediseño UI (Stitch/QuestLog) — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reestilar la UI existente (Inicio y Detalle de plataforma) al design system de Stitch (tema QuestLog: dark, acento violeta, tokens tipo Material), sin cambiar lógica ni features.

**Architecture:** Se conservan dominio, server actions y data fetching. Solo cambia la presentación. Los tokens de Stitch (Tailwind v3 CDN) se traducen al bloque `@theme` de Tailwind v4 en `globals.css`. Un app shell (Sidebar + TopBar + Footer) envuelve todas las páginas desde `layout.tsx`. Componentes de presentación nuevos: `PlatformCard`, `GameCard`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Prisma, Auth.js. Fuentes Inter + Material Symbols por CDN (`<link>` hoisted por React 19).

**Verificación (sin tests de UI):** El proyecto testea lógica de dominio, que no cambia. Cada tarea se verifica con `npm run typecheck`, `npm run lint` y `npm run build`, más revisión visual con `npm run dev`. Nota: el uso de `<img>` dispara el warning `@next/next/no-img-element` (no rompe el build); es aceptable para las portadas.

**Contexto de datos (ya disponible, no tocar):**
- `Platform`: `id, igdbId?, name, slug, generation?, imageUrl?, source`. `imageUrl` es una URL https ya resuelta (logo IGDB) o `null`.
- `Game`: `id, igdbId?, name, slug, platformId, coverUrl?, releaseDate?, summary?, source`. `coverUrl` es una URL https ya resuelta (`t_cover_big`) o `null`.
- `getUserPlatforms(userId) -> { item: UserItem; platform: Platform }[]`
- `getPlatformCollection(userId, platformId) -> { console: UserItem | null; games: { item: UserItem; game: Game }[] }`
- `searchPlatforms(term) -> Platform[]`, `searchGamesForPlatform(id, term) -> Game[]`
- `isComplete(item: UserItem) -> boolean` (export de `@/modules/collection`)
- Server actions existentes: `addConsoleToCollection`, `setConsoleOwnership`, `addGameToCollection`, `signIn`, `signOut`.

---

## Task 1: Tokens del design system en `globals.css`

**Files:**
- Modify (reemplazo total): `src/app/globals.css`

- [ ] **Step 1: Reemplazar `globals.css` con los tokens QuestLog**

```css
@import "tailwindcss";

@theme {
  /* Colores — design system QuestLog (Stitch) */
  --color-background: #0b1326;
  --color-surface: #0b1326;
  --color-surface-dim: #0b1326;
  --color-surface-bright: #31394d;
  --color-surface-container-lowest: #060e20;
  --color-surface-container-low: #131b2e;
  --color-surface-container: #171f33;
  --color-surface-container-high: #222a3d;
  --color-surface-container-highest: #2d3449;
  --color-surface-variant: #2d3449;
  --color-surface-tint: #d0bcff;
  --color-on-surface: #dae2fd;
  --color-on-surface-variant: #cbc3d7;
  --color-on-background: #dae2fd;
  --color-inverse-surface: #dae2fd;
  --color-inverse-on-surface: #283044;
  --color-primary: #d0bcff;
  --color-on-primary: #3c0091;
  --color-primary-container: #a078ff;
  --color-on-primary-container: #340080;
  --color-primary-fixed: #e9ddff;
  --color-primary-fixed-dim: #d0bcff;
  --color-on-primary-fixed: #23005c;
  --color-on-primary-fixed-variant: #5516be;
  --color-inverse-primary: #6d3bd7;
  --color-secondary: #4edea3;
  --color-on-secondary: #003824;
  --color-secondary-container: #00a572;
  --color-on-secondary-container: #00311f;
  --color-secondary-fixed: #6ffbbe;
  --color-secondary-fixed-dim: #4edea3;
  --color-on-secondary-fixed: #002113;
  --color-on-secondary-fixed-variant: #005236;
  --color-tertiary: #ffb869;
  --color-on-tertiary: #482900;
  --color-tertiary-container: #ca801e;
  --color-on-tertiary-container: #3f2300;
  --color-tertiary-fixed: #ffdcbb;
  --color-tertiary-fixed-dim: #ffb869;
  --color-on-tertiary-fixed: #2c1700;
  --color-on-tertiary-fixed-variant: #673d00;
  --color-error: #ffb4ab;
  --color-on-error: #690005;
  --color-error-container: #93000a;
  --color-on-error-container: #ffdad6;
  --color-outline: #958ea0;
  --color-outline-variant: #494454;

  /* Spacing tokens (generan p-*, gap-*, m-*, w-*, ...) */
  --spacing-base: 8px;
  --spacing-stack-sm: 12px;
  --spacing-stack-md: 24px;
  --spacing-stack-lg: 48px;
  --spacing-grid-gutter: 24px;
  --spacing-container-padding-mobile: 20px;
  --spacing-container-padding-desktop: 40px;

  /* Tipografía */
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;

  --text-display-lg: 48px;
  --text-display-lg--line-height: 56px;
  --text-display-lg--letter-spacing: -0.02em;
  --text-display-lg--font-weight: 700;

  --text-headline-lg: 32px;
  --text-headline-lg--line-height: 40px;
  --text-headline-lg--letter-spacing: -0.01em;
  --text-headline-lg--font-weight: 600;

  --text-headline-md: 24px;
  --text-headline-md--line-height: 32px;
  --text-headline-md--font-weight: 600;

  --text-body-lg: 18px;
  --text-body-lg--line-height: 28px;
  --text-body-lg--font-weight: 400;

  --text-body-md: 16px;
  --text-body-md--line-height: 24px;
  --text-body-md--font-weight: 400;

  --text-label-md: 14px;
  --text-label-md--line-height: 20px;
  --text-label-md--letter-spacing: 0.05em;
  --text-label-md--font-weight: 600;

  --text-label-sm: 12px;
  --text-label-sm--line-height: 16px;
  --text-label-sm--font-weight: 500;
}

body {
  background: var(--color-background);
  color: var(--color-on-surface);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* Sombra ambiente para cards de nivel 1 */
.ambient-shadow {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

/* Base del icon-font Material Symbols */
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
```

- [ ] **Step 2: Verificar que compila**

Run: `npm run build`
Expected: build sin errores de CSS (Tailwind v4 acepta el bloque `@theme`).

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(ui): tokens del design system QuestLog en Tailwind v4"
```

---

## Task 2: App shell (Sidebar + TopBar + Footer) y carga de fuentes

**Files:**
- Create: `src/components/sidebar.tsx`
- Create: `src/components/top-bar.tsx`
- Create: `src/components/footer.tsx`
- Modify (reemplazo total): `src/app/layout.tsx`
- Delete: `src/components/site-header.tsx`

- [ ] **Step 1: Crear `src/components/sidebar.tsx`**

```tsx
import Link from "next/link";
import { signIn, signOut } from "@/auth";

type SidebarUser = { name?: string | null } | null;

export function Sidebar({ user }: { user: SidebarUser }) {
  return (
    <nav className="hidden md:flex flex-col w-64 fixed left-0 top-0 h-full py-stack-md bg-surface-dim border-r border-surface-container-low z-40">
      <div className="px-grid-gutter mb-stack-lg">
        <h1 className="text-headline-md font-bold text-primary">gameColector</h1>
        <p className="text-label-sm text-on-surface-variant mt-1">Colección retro</p>
      </div>
      <ul className="flex-1 flex flex-col gap-base px-stack-sm">
        <li>
          <Link
            href="/"
            className="flex items-center gap-stack-sm px-4 py-3 rounded-lg text-primary font-bold border-r-2 border-primary bg-surface-container-low"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              home
            </span>
            <span className="text-body-md">Inicio</span>
          </Link>
        </li>
      </ul>
      <div className="px-stack-sm mt-auto">
        {user ? (
          <div className="px-4 flex items-center justify-between gap-3">
            <span className="text-label-md text-on-surface truncate">
              {user.name}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="text-label-sm text-on-surface-variant hover:text-primary underline"
              >
                Salir
              </button>
            </form>
          </div>
        ) : (
          <form
            className="px-4"
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <button
              type="submit"
              className="w-full bg-primary text-on-primary text-label-md px-4 py-2 rounded-lg hover:bg-primary-fixed transition-colors"
            >
              Entrar con GitHub
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Crear `src/components/top-bar.tsx`**

En móvil la sidebar está oculta, así que el TopBar contiene la marca y el control de sesión.

```tsx
import { signIn, signOut } from "@/auth";

type TopBarUser = { name?: string | null } | null;

export function TopBar({ user }: { user: TopBarUser }) {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-surface-dim/80 backdrop-blur-md z-30 flex items-center justify-between px-grid-gutter">
      <h1 className="text-headline-md font-bold text-primary md:hidden">
        gameColector
      </h1>
      <div className="ml-auto flex items-center gap-stack-sm">
        {user ? (
          <>
            <span className="text-label-md text-on-surface-variant hidden sm:inline">
              {user.name}
            </span>
            <form
              className="md:hidden"
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="text-label-sm text-on-surface-variant hover:text-primary underline"
              >
                Salir
              </button>
            </form>
          </>
        ) : (
          <form
            className="md:hidden"
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <button type="submit" className="text-label-md text-primary">
              Entrar
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Crear `src/components/footer.tsx`**

```tsx
export function Footer() {
  return (
    <footer className="bg-surface-dim w-full py-stack-md mt-auto px-grid-gutter border-t border-outline-variant/20">
      <span className="text-label-md font-bold text-on-surface">gameColector</span>
    </footer>
  );
}
```

- [ ] **Step 4: Reemplazar `src/app/layout.tsx`**

`auth()` se llama una vez y se pasa `user` a Sidebar/TopBar. Los `<link>` de fuentes se renderizan dentro del `<body>`; React 19 los eleva al `<head>` (evita el `<head>` manual desaconsejado en App Router).

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/auth";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "gameColector",
  description: "Gestión de colección de videojuegos retro",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <html lang="es" className="dark">
      <body className="bg-background text-on-surface min-h-screen flex antialiased">
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        <Sidebar user={user} />
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
          <TopBar user={user} />
          <main className="flex-1 pt-16 px-container-padding-mobile md:px-container-padding-desktop pb-stack-lg">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Borrar el header antiguo**

```bash
git rm src/components/site-header.tsx
```

- [ ] **Step 6: Verificar typecheck, lint y build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: sin errores de tipos. `next build` genera las rutas sin errores.

- [ ] **Step 7: Verificación visual**

Run: `npm run dev` y abrir `http://localhost:3000`.
Expected: fondo navy oscuro, sidebar violeta a la izquierda con "gameColector" e "Inicio", topbar con blur. Login/logout con GitHub funcionan.

- [ ] **Step 8: Commit**

```bash
git add src/components/sidebar.tsx src/components/top-bar.tsx src/components/footer.tsx src/app/layout.tsx
git commit -m "feat(ui): app shell (sidebar + topbar + footer) y fuentes por CDN"
```

---

## Task 3: Pantalla Inicio (grid de consolas)

**Files:**
- Create: `src/components/platform-card.tsx`
- Modify (reemplazo total): `src/components/search-form.tsx`
- Modify (reemplazo total): `src/app/page.tsx`

- [ ] **Step 1: Crear `src/components/platform-card.tsx`**

```tsx
import Link from "next/link";
import type { Platform } from "@/generated/prisma/client";

export function PlatformCard({ platform }: { platform: Platform }) {
  return (
    <Link
      href={`/platforms/${platform.id}`}
      className="bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl p-4 flex flex-col items-center justify-center gap-3 border border-white/5 shadow-sm group"
    >
      <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-[28px]">
          sports_esports
        </span>
      </div>
      <span className="text-label-md text-on-surface text-center">
        {platform.name}
      </span>
      {platform.generation ? (
        <span className="text-label-sm text-on-surface-variant">
          Gen {platform.generation}
        </span>
      ) : null}
    </Link>
  );
}
```

- [ ] **Step 2: Reemplazar `src/components/search-form.tsx`**

```tsx
export function SearchForm({
  action,
  placeholder,
  defaultValue,
}: {
  action: string;
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <form method="get" action={action} className="flex gap-2 max-w-md">
      <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
          search
        </span>
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full bg-surface-container-low border border-surface-container-high text-on-surface rounded-full py-2 pl-10 pr-4 text-body-md placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-on-primary text-label-md px-5 rounded-full hover:bg-primary-fixed transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Reemplazar `src/app/page.tsx`**

```tsx
import { auth } from "@/auth";
import { getUserPlatforms } from "@/modules/collection";
import { searchPlatforms } from "@/modules/catalog";
import { SearchForm } from "@/components/search-form";
import { PlatformCard } from "@/components/platform-card";
import { addConsoleToCollection } from "./actions";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="max-w-3xl mx-auto pt-stack-lg">
        <p className="text-body-md text-on-surface-variant">
          Entra con GitHub para gestionar tu colección.
        </p>
      </div>
    );
  }

  const { q } = await searchParams;
  const platforms = await getUserPlatforms(session.user.id);
  const results = q ? await searchPlatforms(q) : [];

  return (
    <div className="max-w-[1440px] mx-auto pt-stack-md">
      <section className="mb-stack-lg">
        <h2 className="text-headline-md text-on-surface mb-stack-md flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            videogame_asset
          </span>
          Tus consolas
        </h2>
        {platforms.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            Aún no has añadido consolas. Busca una abajo para empezar.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map(({ item, platform }) => (
              <PlatformCard key={item.id} platform={platform} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-stack-lg">
        <h2 className="text-headline-md text-on-surface mb-stack-md">
          Añadir consola
        </h2>
        <SearchForm
          action="/"
          placeholder="Buscar consola (p. ej. Super Nintendo)"
          defaultValue={q}
        />
        {q ? (
          <ul className="mt-stack-md rounded-xl border border-surface-container-high bg-surface-container-low divide-y divide-surface-container-high">
            {results.length === 0 ? (
              <li className="p-4 text-body-md text-on-surface-variant">
                Sin resultados.
              </li>
            ) : (
              results.map((platform) => (
                <li
                  key={platform.id}
                  className="flex items-center justify-between p-4"
                >
                  <span className="text-body-md">{platform.name}</span>
                  <form action={addConsoleToCollection.bind(null, platform.id)}>
                    <button
                      type="submit"
                      className="bg-primary text-on-primary text-label-md px-4 py-1.5 rounded-lg hover:bg-primary-fixed transition-colors"
                    >
                      Añadir
                    </button>
                  </form>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Verificar typecheck, lint y build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: sin errores de tipos ni de build.

- [ ] **Step 5: Verificación visual**

Run: `npm run dev`, abrir `/`.
Expected: "Tus consolas" como grid de tarjetas con círculo de icono; buscador redondeado con lupa; resultados en tarjeta oscura con botón violeta "Añadir".

- [ ] **Step 6: Commit**

```bash
git add src/components/platform-card.tsx src/components/search-form.tsx src/app/page.tsx
git commit -m "feat(ui): pantalla Inicio con grid de consolas al estilo QuestLog"
```

---

## Task 4: Pantalla Detalle de plataforma (hero + grid de juegos)

**Files:**
- Create: `src/components/game-card.tsx`
- Modify (reemplazo total): `src/components/item-status.tsx`
- Modify (reemplazo total): `src/app/platforms/[id]/page.tsx`

- [ ] **Step 1: Crear `src/components/game-card.tsx`**

Card de portada con badge de estado. `item` es `null` cuando el juego no está en la colección (resultados de búsqueda).

```tsx
import { isComplete } from "@/modules/collection";
import type { Game, UserItem } from "@/generated/prisma/client";

function StatusBadge({ item }: { item: UserItem | null }) {
  if (!item) {
    return null;
  }
  if (item.ownership === "wishlist") {
    return (
      <div
        className="absolute top-3 right-3 bg-error-container/90 backdrop-blur-sm text-error p-1.5 rounded-full border border-error/20"
        title="En lista de deseos"
      >
        <span
          className="material-symbols-outlined text-[16px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          favorite
        </span>
      </div>
    );
  }
  const complete = isComplete(item);
  return (
    <div
      className="absolute top-3 right-3 bg-secondary-container/90 backdrop-blur-sm text-secondary-fixed-dim p-1.5 rounded-full border border-secondary/20"
      title={complete ? "Completo" : "En colección"}
    >
      <span
        className="material-symbols-outlined text-[16px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {complete ? "check_circle" : "check"}
      </span>
    </div>
  );
}

export function GameCard({
  game,
  item,
}: {
  game: Game;
  item: UserItem | null;
}) {
  return (
    <article className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-surface-container-low ambient-shadow border border-white/5">
      {game.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={game.coverUrl}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-surface-container flex items-center justify-center p-3">
          <span className="text-label-md text-on-surface-variant text-center">
            {game.name}
          </span>
        </div>
      )}
      <StatusBadge item={item} />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 p-3 w-full">
        <h3 className="text-label-md text-on-surface truncate">{game.name}</h3>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Reemplazar `src/components/item-status.tsx`**

```tsx
import { isComplete } from "@/modules/collection";
import type { UserItem } from "@/generated/prisma/client";

export function ItemStatus({ item }: { item: UserItem | null }) {
  if (!item) {
    return (
      <span className="text-label-sm text-on-surface-variant">
        No en tu colección
      </span>
    );
  }
  if (item.ownership === "wishlist") {
    return <span className="text-label-sm text-error">En lista de deseos</span>;
  }
  const complete = isComplete(item);
  return (
    <span
      className={`text-label-sm ${complete ? "text-secondary" : "text-on-surface-variant"}`}
    >
      {complete ? "Completo" : "Incompleto"}
    </span>
  );
}
```

- [ ] **Step 3: Reemplazar `src/app/platforms/[id]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getPlatform, searchGamesForPlatform } from "@/modules/catalog";
import { getPlatformCollection } from "@/modules/collection";
import { SearchForm } from "@/components/search-form";
import { ItemStatus } from "@/components/item-status";
import { GameCard } from "@/components/game-card";
import { addGameToCollection, setConsoleOwnership } from "./actions";

const ownershipButton = "text-label-md px-5 py-2 rounded-lg transition-colors";
const addButton =
  "text-label-md px-4 py-1.5 rounded-lg transition-colors";

export default async function PlatformPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const platform = await getPlatform(id);
  if (!platform) {
    notFound();
  }

  const { q } = await searchParams;
  const collection = await getPlatformCollection(user.id, id);
  const results = q ? await searchGamesForPlatform(id, q) : [];
  const collectedGameIds = new Set(collection.games.map(({ game }) => game.id));

  return (
    <div className="max-w-[1440px] mx-auto pt-stack-md">
      <section className="relative rounded-xl overflow-hidden bg-surface-container-low ambient-shadow border border-white/5">
        <div className="relative min-h-64 md:min-h-80 flex flex-col justify-end p-grid-gutter">
          {platform.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={platform.imageUrl}
                alt={platform.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent" />
            </>
          ) : null}
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-stack-sm">
            <div className="max-w-3xl">
              {platform.generation ? (
                <span className="inline-block px-2 py-1 bg-surface-variant text-on-surface text-label-sm rounded mb-2 border border-white/10 uppercase tracking-widest">
                  Gen {platform.generation}
                </span>
              ) : null}
              <h1 className="text-display-lg text-on-surface mb-2">
                {platform.name}
              </h1>
              <ItemStatus item={collection.console} />
            </div>
            <div className="flex gap-2">
              <form action={setConsoleOwnership.bind(null, id, "owned")}>
                <button
                  type="submit"
                  className={`${ownershipButton} bg-primary text-on-primary hover:bg-primary-fixed`}
                >
                  Tengo
                </button>
              </form>
              <form action={setConsoleOwnership.bind(null, id, "wishlist")}>
                <button
                  type="submit"
                  className={`${ownershipButton} bg-surface-variant text-on-surface hover:bg-surface-container-highest`}
                >
                  Deseo
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-stack-lg">
        <h2 className="text-headline-md text-on-surface mb-stack-md">
          Tus juegos
        </h2>
        {collection.games.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">Ninguno todavía.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-grid-gutter">
            {collection.games.map(({ item, game }) => (
              <GameCard key={item.id} game={game} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-stack-lg">
        <h2 className="text-headline-md text-on-surface mb-stack-md">
          Añadir juegos
        </h2>
        <SearchForm
          action={`/platforms/${id}`}
          placeholder="Buscar juego"
          defaultValue={q}
        />
        {q ? (
          <ul className="mt-stack-md rounded-xl border border-surface-container-high bg-surface-container-low divide-y divide-surface-container-high">
            {results.length === 0 ? (
              <li className="p-4 text-body-md text-on-surface-variant">
                Sin resultados.
              </li>
            ) : (
              results.map((game) => (
                <li
                  key={game.id}
                  className="flex items-center justify-between p-4 gap-3"
                >
                  <span className="text-body-md">
                    {game.name}
                    {collectedGameIds.has(game.id) ? (
                      <span className="ml-2 text-label-sm text-on-surface-variant">
                        · ya en tu colección
                      </span>
                    ) : null}
                  </span>
                  <div className="flex gap-2">
                    <form
                      action={addGameToCollection.bind(null, id, game.id, "owned")}
                    >
                      <button
                        type="submit"
                        className={`${addButton} bg-primary text-on-primary hover:bg-primary-fixed`}
                      >
                        Tengo
                      </button>
                    </form>
                    <form
                      action={addGameToCollection.bind(
                        null,
                        id,
                        game.id,
                        "wishlist",
                      )}
                    >
                      <button
                        type="submit"
                        className={`${addButton} bg-surface-variant text-on-surface hover:bg-surface-container-highest`}
                      >
                        Deseo
                      </button>
                    </form>
                  </div>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Verificar typecheck, lint y build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: sin errores de tipos ni de build (los `<img>` llevan `eslint-disable-next-line`).

- [ ] **Step 5: Verificación visual**

Run: `npm run dev`, abrir una plataforma con juegos.
Expected: cabecera hero (con imagen si la plataforma tiene `imageUrl`), grid de portadas con badge verde (poseído) / rojo favorito (wishlist), botones Tengo/Deseo, buscador de juegos.

- [ ] **Step 6: Commit**

```bash
git add src/components/game-card.tsx src/components/item-status.tsx "src/app/platforms/[id]/page.tsx"
git commit -m "feat(ui): detalle de plataforma con hero y grid de portadas"
```

---

## Task 5: Reescribir la regla de UI

**Files:**
- Modify (reemplazo total): `.claude/rules/ui-design.md`

- [ ] **Step 1: Reemplazar `.claude/rules/ui-design.md`**

```markdown
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
  con `style={{ fontVariationSettings: "'FILL' 1" }}`.
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
  estado (verde `check`/`check_circle` = poseído; rojo `favorite` = wishlist;
  sin badge = no poseído). Placeholder con el título cuando falta portada.
- **Estado de completitud**: derivado de los flags de `data-model.md`, mostrado
  compacto (`ItemStatus`, colores con significado).
- Estados vacíos con texto útil y una acción, sin ilustraciones.

## Componentes

- Componentes propios, pequeños y reutilizables; sin librería de UI pesada.
- Accesibilidad básica: contraste suficiente, foco visible (`ring-primary`),
  `alt` en imágenes, controles navegables por teclado.
- La UI no contiene lógica de negocio ni llamadas externas (ver
  `architecture.md`).

## Tokens

- Todos los tokens (colores, spacing, tipografía) viven en el bloque `@theme` de
  `src/app/globals.css`, traducidos del design system QuestLog de Stitch. Añadir
  o cambiar un token allí, no con valores arbitrarios en las clases.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/rules/ui-design.md
git commit -m "docs: reescribe ui-design.md al design system QuestLog"
```

---

## Task 6: Verificación final y PR

- [ ] **Step 1: Verificación completa**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: typecheck y build sin errores; lint solo con warnings esperados de `<img>` (silenciados con `eslint-disable-next-line`).

- [ ] **Step 2: Revisión visual comparando con Stitch**

Run: `npm run dev`. Comparar `/` y `/platforms/[id]` contra las capturas de Stitch (Inicio y Detalle de plataforma NES) en el scratchpad. Confirmar: tema dark, sidebar violeta, cards, hero, badges de estado, login/logout.

- [ ] **Step 3: Abrir PR y revisión por agente**

Seguir `git-workflow.md`: push de `feat/stitch-redesign`, abrir PR vía MCP de GitHub describiendo qué/por qué/cómo probar, revisión por `code-reviewer`. Resolver hallazgos antes de mergear. Merge automático a `main` si la revisión pasa sin hallazgos.

---

## Notas de cobertura del spec

- Tokens Tailwind v4 (colores/spacing/tipografía) → Task 1.
- Fuentes/iconos por CDN → Task 2.
- App shell (sidebar/topbar/footer, sin items fake) → Task 2.
- Inicio (grid de consolas, sin carrusel) → Task 3.
- Detalle de plataforma (hero + grid de portadas, badges, sin tabs) → Task 4.
- Reescritura de `ui-design.md` → Task 5.
- Sin tests nuevos; verificación build/visual → todas las tasks + Task 6.
- Fuera de alcance (Explorador, Detalle de Juego, precios, wishlist como página) → no hay tasks, es correcto.
```
