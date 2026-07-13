# Autenticación

Auth.js v5 (`next-auth`) con adapter Prisma. Multiusuario. La colección y la
wishlist son por usuario (`UserItem.userId`).

## Provider

- **GitHub OAuth**. Auth.js lee `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` del
  entorno por convención (no se pasan en código).
- Callback de la GitHub OAuth App: `http://localhost:3000/api/auth/callback/github`
  (ajustar host en producción).
- Config en `src/auth.ts`; route handler en `src/app/api/auth/[...nextauth]/route.ts`.

## Sesión

- **Sesión por base de datos** (por defecto con el adapter Prisma): modelos
  `User`, `Account`, `Session` en `schema.prisma`.
- `trustHost: true` (self-hosted, no Vercel).
- `AUTH_SECRET` obligatorio (generar con `npx auth secret`).

## Uso

- Estado de sesión en server components con `auth()` de `@/auth`.
- Sign in / sign out con las server actions `signIn("github")` / `signOut()`.
- Secretos solo en variables de entorno del servidor; nunca en el cliente.

## Pendiente (otros specs)

- Protección de rutas / middleware cuando haya contenido por-usuario.
