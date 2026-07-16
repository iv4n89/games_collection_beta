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
        <span
          className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          aria-hidden="true"
        >
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
        className="bg-primary text-on-primary text-label-md px-5 rounded-full hover:bg-primary-fixed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Buscar
      </button>
    </form>
  );
}
