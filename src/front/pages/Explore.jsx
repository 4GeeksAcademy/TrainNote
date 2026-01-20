import { useEffect, useMemo, useRef, useState } from "react";

import MapView from "../components/Map/MapView";
import RouteRegistrationHeader from "../components/RouteRegistration/RouteRegistrationHeader";
import RouteRegistrationBottomNav from "../components/RouteRegistration/RouteRegistrationBottomNav";

import useRoutePlanner from "../hooks/useRoutePlanner";
// import { saveRoute } from "../services/routesStorage"; // lo tienes importado pero aún no lo usas

import mapboxgl from "mapbox-gl";
import { geocodePlace } from "../services/geocoding";

import "../styles/routeRegistration.css";

const STORAGE_KEY_PLANNED = "trail_planned_routes";

export default function Explore() {
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState(null);

  const [activeFilter, setActiveFilter] = useState("gravel");
  const [routeName] = useState("Nueva ruta");

  const mapRef = useRef(null);
  const searchMarkerRef = useRef(null);

  const {
    waypoints,
    summary,
    error: planError,
    clear,
    attachMapClick,
    detachMapClick,
  } = useRoutePlanner(mapRef, "cycling");

  const canSave = useMemo(() => {
    const coords = summary?.geojsonLine?.geometry?.coordinates;
    return Array.isArray(coords) && coords.length >= 2;
  }, [summary]);

  useEffect(() => {
    return () => {
      detachMapClick();
      if (searchMarkerRef.current) searchMarkerRef.current.remove();
    };
  }, [detachMapClick]);

  const savePlannedRoute = () => {
    if (!canSave) return;

    const plannedRoute = {
      id: crypto.randomUUID(),
      type: "planned",
      name: routeName,
      terrain: activeFilter,
      distance_km: summary.distanceKm,
      duration_min: summary.durationMin,
      geojson: summary.geojsonLine,
      created_at: new Date().toISOString(),
    };

    const prev = JSON.parse(localStorage.getItem(STORAGE_KEY_PLANNED) || "[]");
    localStorage.setItem(
      STORAGE_KEY_PLANNED,
      JSON.stringify([plannedRoute, ...prev])
    );
  };

  const runSearch = async () => {
    const q = (searchValue || "").trim();
    if (!q) return;

    try {
      setSearchError(null);
      const map = mapRef.current;
      if (!map) return;

      const c = map.getCenter?.();
      const proximity = c ? [c.lng, c.lat] : undefined;

      const result = await geocodePlace(q, {
        limit: 1,
        language: "es",
        country: "es",
        proximity,
      });

      if (!result) {
        setSearchError("No se encontraron resultados.");
        return;
      }

      const [lng, lat] = result.center;

      map.flyTo({ center: [lng, lat], zoom: 12, essential: true });

      if (searchMarkerRef.current) searchMarkerRef.current.remove();
      searchMarkerRef.current = new mapboxgl.Marker({ color: "#111827" })
        .setLngLat([lng, lat])
        .addTo(map);
    } catch (e) {
      setSearchError(String(e?.message ?? e));
    }
  };

  return (
    <div className="rr-page">
      <MapView
        className="rr-map"
        center={[-0.52, 42.51]}
        zoom={12}
        onMapLoad={(map) => {
          mapRef.current = map;

          setTimeout(() => {
            map.doubleClickZoom?.disable?.();
            attachMapClick();
          }, 0);
        }}
      />

      <div className="rr-overlay-top">
        <RouteRegistrationHeader
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={runSearch}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      <div className="rr-coords">Puntos: {waypoints.length}</div>

      {searchError && <div className="rr-error">Buscar: {searchError}</div>}

      <div className="rr-overlay-cards">
        <div className="rr-card">
          <div className="rr-card-title">{routeName}</div>
          <div className="rr-card-subtitle">
            Terreno: {activeFilter.toUpperCase()} · Listo
          </div>

          <div className="rr-card-metrics">
            <div>
              <div className="rr-m-label">DISTANCIA</div>
              <div className="rr-m-val">{summary.distanceKm.toFixed(2)} km</div>
            </div>

            <div>
              <div className="rr-m-label">TIEMPO</div>
              <div className="rr-m-val">{summary.durationMin.toFixed(0)} min</div>
            </div>

            <div
              className="rr-rating"
              style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
            >
              <button type="button" className="rr-clear" onClick={clear}>
                LIMPIAR
              </button>

              <button
                type="button"
                className="rr-clear"
                onClick={savePlannedRoute}
                disabled={!canSave}
                title={
                  !canSave
                    ? "Añade al menos 2 puntos para guardar"
                    : "Guardar ruta planificada"
                }
                style={{
                  opacity: canSave ? 1 : 0.5,
                  cursor: canSave ? "pointer" : "not-allowed",
                }}
              >
                GUARDAR
              </button>
            </div>
          </div>

          {planError && (
            <div className="rr-error">
              Plan: {String(planError.message ?? planError)}
            </div>
          )}
        </div>
      </div>

      <RouteRegistrationBottomNav
        isRecording={false}
        fabTo="/route-registration"
        fabLabel="Ir a grabar ruta"
        fabTitle="Grabar ruta"
      />
    </div>
  );
}
