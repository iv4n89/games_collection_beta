import { auth } from "@/auth";
import { getPlatformsOverview } from "@/modules/collection";
import { PlatformModuleCard } from "@/components/platform-module-card";

export default async function ExplorePage() {
  const session = await auth();
  const overviews = await getPlatformsOverview(session?.user?.id ?? null);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-grid-gutter">
          {overviews.map((overview) => (
            <PlatformModuleCard
              key={overview.platform.id}
              overview={overview}
            />
          ))}
        </div>
      )}
    </div>
  );
}
