# Integración IGDB

IGDB provee datos e imágenes de **juegos y consolas**. No cubre accesorios ni
todas las ediciones especiales: esos se registran manualmente (`source = manual`).

## Auth

- IGDB usa credenciales de **Twitch** (client id + secret) para obtener un token
  OAuth (client credentials).
- El token se cachea y se renueva al expirar. No pedir token en cada llamada.
- Credenciales solo en variables de entorno del servidor. Nunca en el cliente ni
  en el repo.

## Caché en DB propia

- Preferir el catálogo local. Datos de detalle (summary/categoría de plataforma,
  medios de juego) se rellenan de forma perezosa una sola vez (marcador) y se
  cachean.
- Al buscar/añadir un ítem que no está en catálogo, se obtiene de IGDB y se
  persiste (`source = igdb`) para uso posterior.
- Guardar `igdbId` para poder re-sincronizar.

### Navegación paginada (browse-time)

- El catálogo oficial completo de una plataforma (cientos/miles de juegos) no se
  puede sembrar entero. Por eso el **listado paginado** de una plataforma pide
  cada página a IGDB en tiempo de navegación (`getPlatformGamesPage`,
  `searchPlatformGames`) y cachea al vuelo lo que trae.
- Estas llamadas en render **deben** ir con `try/catch` y degradar al catálogo
  local si IGDB falla (nunca romper el render).
- El resto de vistas (home, colección) siguen leyendo del catálogo local.

## Imágenes

- Guardar la URL/identificador de imagen de IGDB, no descargar los binarios.
- Usar el tamaño adecuado de la API de imágenes de IGDB para cada contexto
  (miniatura vs portada). No servir imágenes gigantes en listados.

## Rate limits

- IGDB limita peticiones por segundo. El cliente serializa/agrupa consultas y
  respeta el límite. Preferir consultas por lotes a muchas sueltas.
- Toda la interacción con IGDB pasa por el subsistema `igdb`; ningún otro módulo
  llama a la API directamente.

## Límites del modelo

- Un `Game` de IGDB puede existir en varias plataformas. En este proyecto la
  colección se organiza por consola, así que el `Game` del catálogo se ancla a
  una `platformId`. Un mismo juego en dos consolas = dos entradas de catálogo.
