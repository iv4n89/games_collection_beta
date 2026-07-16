import { auth } from "@/auth";
import { getPlatformsOverview } from "@/modules/collection";
import {
  seedAllPlatforms,
  ensurePlatformGameCounts,
} from "@/modules/catalog";
import { PlatformGrid } from "@/components/platform-grid";

export default async function ExplorePage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  let overviews = await getPlatformsOverview(userId);
  if (overviews.length < 50) {
    try {
      await seedAllPlatforms();
      overviews = await getPlatformsOverview(userId);
    } catch {
      // IGDB no disponible: se muestran las plataformas ya cacheadas.
    }
  }
  try {
    await ensurePlatformGameCounts();
    overviews = await getPlatformsOverview(userId);
  } catch {
    // IGDB no disponible: los totales se completarán en otra visita.
  }

  return (
    <div className="max-w-[1440px] mx-auto pt-stack-md">
      <div className="mb-stack-md">
        <h2 className="text-headline-lg text-on-surface mb-2">Plataformas</h2>
        <p className="text-body-md text-on-surface-variant">
          Explora y gestiona las consolas de tu colección.
        </p>
      </div>

      {overviews.length === 0 ? (
        <p className="text-body-md text-on-surface-variant">
          Aún no hay plataformas en el catálogo. Busca una consola desde Inicio.
        </p>
      ) : (
        <PlatformGrid overviews={overviews} />
      )}
    </div>
  );
}
