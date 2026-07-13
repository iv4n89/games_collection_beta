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
    <form method="get" action={action} className="flex gap-2">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
      />
      <button
        type="submit"
        className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
      >
        Buscar
      </button>
    </form>
  );
}
