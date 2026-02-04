import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    <div className="home">
      <div className="home-content">
        <main className="home-content">

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 16
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

          {filtered.length === 0 ? (
            <p>No saved routes yet.</p>
          ) : (
            filtered.map((r) => (
              <div
                key={r.id}
                className="ui-panel"
                style={{ marginBottom: 12 }}
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
                      className="ui-btn ui-btn--secondary"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="ui-btn ui-btn--danger"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}

        </main>
      </div>
    </div>
  );
}
