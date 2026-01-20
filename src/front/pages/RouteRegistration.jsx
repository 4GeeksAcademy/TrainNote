import { useEffect, useRef, useState } from "react";
import { saveRoute } from "../services/routesStorage";
import useRouteRecorder from "../hooks/useRouteRecorder";

import MapView from "../components/Map/MapView";
import RouteRegistrationHeader from "../components/RouteRegistration/RouteRegistrationHeader";
import RouteRegistrationBottomNav from "../components/RouteRegistration/RouteRegistrationBottomNav";

import "../styles/routeRegistration.css";

export default function RouteRegistration() {
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("gravel");
  const [routeName] = useState("Nueva ruta");

  
  const mapRef = useRef(null);

  
  const { isRecording, points, currentPos, metrics, geojsonLine, toggle, onMapReady, error } =
    useRouteRecorder(mapRef);
  
  
// guardar la ruta cuando se deja de grabar

const prevIsRecording = useRef(false);

useEffect(() => {
  
  if (prevIsRecording.current && !isRecording) {
    const coords = geojsonLine?.geometry?.coordinates;

    
    if (Array.isArray(coords) && coords.length >= 2) {
      const makeId = () => {
        try {
          return crypto.randomUUID();
        } catch {
          return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        }
      };

      saveRoute({
        id: makeId(),
        type: "recorded",
        name: routeName,
        terrain: activeFilter,
        distance_km: metrics.distanceKm,
        duration_min: null,
        gain_m: metrics.gainM,
        geojson: geojsonLine,
        created_at: new Date().toISOString(),
      });
    }
  }

  prevIsRecording.current = isRecording;
}, [isRecording, geojsonLine, metrics.distanceKm, metrics.gainM, routeName, activeFilter]);


  return (
    <div className="rr-page">
      <MapView
        className="rr-map"
        center={[-0.52, 42.51]}
        zoom={12}
        onMapLoad={(map) => {
          mapRef.current = map;
          onMapReady(map);
          requestAnimationFrame(() => map.resize());
          setTimeout(() => map.resize(), 150);
        }}
      />

      <div className="rr-overlay-top">
        <RouteRegistrationHeader
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      <div className="rr-coords">
        {error ? (
          <div className="rr-error">GPS: {String(error.message ?? error)}</div>
        ) : currentPos ? (
          <>
            <div>
              <b>Lat:</b> {currentPos.lat.toFixed(6)}
            </div>
            <div>
              <b>Lng:</b> {currentPos.lng.toFixed(6)}
            </div>
            {currentPos.alt != null && (
              <div>
                <b>Alt:</b> {Math.round(currentPos.alt)} m
              </div>
            )}
          </>
        ) : (
          <div>Esperando GPS…</div>
        )}
      </div>

      <div className="rr-overlay-cards">
        <div className="rr-card">
          <div className="rr-card-title">{routeName.toUpperCase()}</div>
          <div className="rr-card-sub">
            Terreno: <b>{activeFilter.toUpperCase()}</b>{" "}
            {isRecording ? "· Grabando…" : "· Listo"}
          </div>

          <div className="rr-card-metrics">
            <div>
              <div className="rr-m-label">DISTANCIA</div>
              <div className="rr-m-val">{metrics.distanceKm.toFixed(2)} km</div>
            </div>
            <div>
              <div className="rr-m-label">DESNIVEL</div>
              <div className="rr-m-val">{metrics.gainM} m</div>
            </div>
            <div className="rr-rating">{isRecording ? "● REC" : "▶ START"}</div>
          </div>

          
          <div style={{ display: "none" }}>
            {JSON.stringify({ points: points.length, geojsonLine })}
          </div>
        </div>
      </div>

      <RouteRegistrationBottomNav onStart={toggle} isRecording={isRecording} />
    </div>
  );
}
