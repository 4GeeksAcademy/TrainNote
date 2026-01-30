import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import RouteRegistrationBottomNav from "../components/RouteRegistration/RouteRegistrationBottomNav";
import { deleteRoute, getRoutes } from "../services/routesStorage";

export default function SavedRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  const [routes, setRoutes] = useState([]);
  const [filter, setFilter] = useState("all"); 

  
  useEffect(() => {
    setRoutes(getRoutes());
  }, [location.key]);

  const filtered = useMemo(() => {
    const sorted = [...routes].sort((a, b) =>
      String(b.created_at || "").localeCompare(String(a.created_at || ""))
    );

    if (filter === "planned") return sorted.filter((r) => r.type === "planned");
    if (filter === "recorded") return sorted.filter((r) => r.type === "recorded");
    return sorted;
  }, [routes, filter]);

  const handleDelete = (id) => {
    const next = deleteRoute(id);
    setRoutes(next);
  };

  return (
    <div style={{ padding: 16, paddingBottom: 92 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>Saved Routes</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: 8, borderRadius: 10 }}
        >
          <option value="all">All</option>
          <option value="planned">Planned</option>
          <option value="recorded">Recorded</option>
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        {filtered.length === 0 ? (
          <p>No saved routes yet.</p>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,.12)",
                borderRadius: 16,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 900, textTransform: "uppercase" }}>
                    {r.name || "Untitled"}
                  </div>

                  <div style={{ opacity: 0.8, marginTop: 4 }}>
                    {String(r.type).toUpperCase()} · {(r.terrain || "").toUpperCase()}
                  </div>

                  <div style={{ opacity: 0.9, marginTop: 6 }}>
                    {r.distance_km != null ? `${Number(r.distance_km).toFixed(2)} km` : "—"}
                    {" · "}
                    {r.duration_min != null ? `${Math.round(Number(r.duration_min))} min` : "—"}
                    {" · "}
                    {r.gain_m != null ? `${Math.round(Number(r.gain_m))} m` : "—"}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => navigate(`/saved-routes/${r.id}`)}
                    style={{ border: 0, background: "transparent", fontWeight: 900, cursor: "pointer" }}
                    title="View on map"
                  >
                    VIEW
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    style={{ border: 0, background: "transparent", fontWeight: 900, cursor: "pointer", opacity: 0.7 }}
                    title="Delete"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <RouteRegistrationBottomNav isRecording={false} fabTo="/route-registration" />
    </div>
  );
}
