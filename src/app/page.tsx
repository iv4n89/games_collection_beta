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
          <span className="material-symbols-outlined text-primary" aria-hidden="true">
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
        <h2 className="text-headline-md text-on-surface mb-stack-md">Añadir consola</h2>
        <SearchForm
          action="/"
          placeholder="Buscar consola (p. ej. Super Nintendo)"
          defaultValue={q}
        />
        {q ? (
          <ul className="mt-stack-md rounded-xl border border-surface-container-high bg-surface-container-low divide-y divide-surface-container-high">
            {results.length === 0 ? (
              <li className="p-4 text-body-md text-on-surface-variant">Sin resultados.</li>
            ) : (
              results.map((platform) => (
                <li key={platform.id} className="flex items-center justify-between p-4">
                  <span className="text-body-md">{platform.name}</span>
                  <form action={addConsoleToCollection.bind(null, platform.id)}>
                    <button
                      type="submit"
                      className="bg-primary text-on-primary text-label-md px-4 py-1.5 rounded-lg hover:bg-primary-fixed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
