import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MapView from "../components/Map/MapView";
import RouteRegistrationBottomNav from "../components/RouteRegistration/RouteRegistrationBottomNav";
import { getRoutes } from "../services/routesStorage";
//import { boundsFromCoords } from "../utils/mapBounds";

const SOURCE_ID = "saved-route-src";
const LAYER_ID = "saved-route-line";

export default function SavedRouteDetail() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const route = useMemo(() => {
    const all = getRoutes();
    return all.find((r) => String(r.id) === String(routeId));
  }, [routeId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !route?.geojson) return;

    const ensure = () => {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, { type: "geojson", data: route.geojson });
      } else {
        map.getSource(SOURCE_ID).setData(route.geojson);
      }

      if (!map.getLayer(LAYER_ID)) {
        map.addLayer({
          id: LAYER_ID,
          type: "line",
          source: SOURCE_ID,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-width": 5, "line-opacity": 0.9, "line-color": "#3B82F6" },
        });
      }

      const coords = route?.geojson?.geometry?.coordinates || [];
      if (coords.length >= 2) {
        const b = boundsFromCoords(coords);
        map.fitBounds(b, { padding: 60, duration: 800 });
      }
    };

    if (map.isStyleLoaded()) ensure();
    else map.once("load", ensure);
  }, [route]);

  if (!route) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Route not found</h2>
        <button onClick={() => navigate("/saved-routes")}>Back</button>
      </div>
    );
  }

  return (
    <div className="rr-page">
      <MapView
        className="rr-map"
        center={[-0.52, 42.51]}
        zoom={12}
        onMapLoad={(map) => {
          mapRef.current = map;
          setTimeout(() => map.resize(), 0);
        }}
      />

      <div className="rr-overlay-cards">
        <div className="rr-card">
          <div className="rr-card-title">{(route.name || "Saved route").toUpperCase()}</div>
          <div className="rr-card-subtitle">
            {String(route.type).toUpperCase()} · {(route.terrain || "").toUpperCase()}
          </div>

          <div className="rr-card-metrics">
            <div>
              <div className="rr-m-label">DISTANCIA</div>
              <div className="rr-m-val">
                {route.distance_km != null ? Number(route.distance_km).toFixed(2) : "0.00"} km
              </div>
            </div>

            <div>
              <div className="rr-m-label">TIEMPO</div>
              <div className="rr-m-val">
                {route.duration_min != null ? Math.round(Number(route.duration_min)) : 0} min
              </div>
            </div>

            <div className="rr-rating">
              <button type="button" className="rr-clear" onClick={() => navigate("/saved-routes")}>
                BACK
              </button>
            </div>
          </div>
        </div>
      </div>

      <RouteRegistrationBottomNav isRecording={false} fabTo="/route-registration" />
    </div>
  );
}
 