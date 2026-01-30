export default function RouteRegistrationHeader({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  activeFilter,
  onFilterChange,
}) {
  const filters = [
    { id: "gravel", label: "GRAVEL" },
    { id: "mtb", label: "ENDURO" },
    { id: "stops", label: "CC" },
  ];

  return (
    <div className="rr-header">
      <div className="rr-search">
        <span className="rr-search-icon">⌕</span>

        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearchSubmit?.();
          }}
          placeholder="Buscar rutas o lugares"
        />

        <button
          className="rr-search-btn"
          type="button"
          aria-label="Buscar"
          title="Buscar"
          onClick={() => onSearchSubmit?.()}
        >
          ↵
        </button>
      </div>

      <div className="rr-chips">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`rr-chip ${activeFilter === f.id ? "active" : ""}`}
            onClick={() => onFilterChange?.(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
