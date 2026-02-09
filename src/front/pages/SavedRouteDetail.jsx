import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MapView from "../components/Map/MapView";
import RouteRegistrationBottomNav from "../components/RouteRegistration/RouteRegistrationBottomNav";
import { getRouteById } from "../services/routesStorage";
import { boundsFromCoords } from "../utils/mapBounds";

const SOURCE_ID = "saved-route-src";
const LAYER_ID = "saved-route-line";

export default function SavedRouteDetail() {

  const { routeId } = useParams();
  const navigate = useNavigate();

  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cancelled = { current: false };

    const loadRoute = async () => {
      try {
        setLoading(true);
        const found = await getRouteById(routeId);
        if (!cancelled.current) setRoute(found);
      } catch {
        if (!cancelled.current) setRoute(null);
      } finally {
        if (!cancelled.current) setLoading(false);
      }
    };

    loadRoute();

    return () => {
      cancelled.current = true;
    };
  }, [routeId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map || !route) return;

    const coords = route.preview_coords;
    if (!coords || !Array.isArray(coords) || coords.length < 2) return;

    const feature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coords,
      },
    };
     

    const draw = () => {
      
      const existingSource = map.getSource(SOURCE_ID);
      if (!existingSource) {
        map.addSource(SOURCE_ID, { type: "geojson", data: feature });
      } else {
        existingSource.setData(feature);
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

      map.fitBounds(boundsFromCoords(coords), { padding: 60, duration: 800 });
    };

    const onStyleLoad = () => draw();

    if (map.isStyleLoaded()) draw();
    else map.once("load", draw);

    map.on("style.load", onStyleLoad);

    return () => {
      map.off("style.load", onStyleLoad);
    };
  }, [route, mapReady]);

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Loading route...</h2>
      </div>
    );
  }

  if (!route) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Route not found</h2>
        <button type="button" onClick={() => navigate("/saved-routes")}>
          Back
        </button>
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
          setMapReady(true);
          requestAnimationFrame(() => map.resize());
          setTimeout(() => map.resize(), 150);
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
