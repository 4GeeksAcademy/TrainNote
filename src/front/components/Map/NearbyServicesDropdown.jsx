export default function NearbyServicesDropdown({
  open,
  data,
  error,
  enabledKeys,
  onChangeEnabledKeys,
  onClose,
}) {
  if (!open) return null;

  const counts = {
    fuel: data?.fuel?.length ?? 0,
    food: data?.food?.length ?? 0,
    hospital: data?.hospital?.length ?? 0,
    bike: data?.bike?.length ?? 0,
  };

  const toggle = (key) => {
    if (enabledKeys.includes(key)) {
      onChangeEnabledKeys(enabledKeys.filter((k) => k !== key));
    } else {
      onChangeEnabledKeys([...enabledKeys, key]);
    }
  };

  const Item = ({ k, label, count }) => (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.06)",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="checkbox"
          checked={enabledKeys.includes(k)}
          onChange={() => toggle(k)}
        />
        <span style={{ fontWeight: 800 }}>{label}</span>
      </span>
      <span style={{ opacity: 0.9, fontWeight: 900 }}>{count}</span>
    </label>
  );

  return (
    <div
      style={{
        position: "absolute",
        right: 16,
        bottom: 160, // sube por encima de la card
        width: 320,
        maxWidth: "calc(100vw - 32px)",
        zIndex: 60,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          background: "rgba(7, 13, 26, 0.92)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 16,
          padding: 12,
          boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div style={{ fontWeight: 900, letterSpacing: 0.3 }}>SERVICIOS</div>
          <button
            onClick={onClose}
            style={{
              border: 0,
              background: "transparent",
              color: "#fbbf24",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            CERRAR
          </button>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 10,
              padding: "8px 10px",
              borderRadius: 12,
              background: "rgba(176,0,32,0.25)",
              border: "1px solid rgba(176,0,32,0.45)",
              fontWeight: 700,
            }}
          >
            ❌ {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gap: 5,
            maxHeight: 220, 
            overflow: "auto",
          }}
        >
          <Item k="fuel" label="Gasolineras" count={counts.fuel} />
          <Item k="food" label="Comida / Súper" count={counts.food} />
          <Item k="hospital" label="Hospital" count={counts.hospital} />
          <Item k="bike" label="Tienda bici" count={counts.bike} />
        </div>
      </div>
    </div>
  );
}
