import { useCallback, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

const PLANNER_SOURCE_ID = "rr-planner-route";
const PLANNER_LAYER_ID = "rr-planner-route-line";

const emptyLine = () => ({
  type: "Feature",
  geometry: { type: "LineString", coordinates: [] },
  properties: {},
});

export default function useRoutePlanner(mapRef, profile = "cycling") {
  const [waypoints, setWaypoints] = useState([]);
  const [route, setRoute] = useState(null);
  const [error, setError] = useState(null);

  const markersRef = useRef([]);
  const clickHandlerRef = useRef(null);

  const ensurePlannerLayer = useCallback((map) => {
    if (!map) return;

    if (!map.getSource(PLANNER_SOURCE_ID)) {
      map.addSource(PLANNER_SOURCE_ID, { type: "geojson", data: emptyLine() });
    }

    if (!map.getLayer(PLANNER_LAYER_ID)) {
      map.addLayer({
        id: PLANNER_LAYER_ID,
        type: "line",
        source: PLANNER_SOURCE_ID,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-width": 5, "line-opacity": 0.9, "line-color": "#3B82F6" },
      });
    }
  }, []);

  const setRouteOnMap = useCallback((map, geojsonLine) => {
    const src = map?.getSource?.(PLANNER_SOURCE_ID);
    if (!src) return;
    src.setData(geojsonLine ?? emptyLine());
  }, []);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  const drawWaypointMarkers = useCallback(
    (map, pts) => {
      if (!map) return;
      clearMarkers();

      pts.forEach((p, idx) => {
        const el = document.createElement("div");
        el.style.width = "26px";
        el.style.height = "26px";
        el.style.borderRadius = "999px";
        el.style.background = "#111827";
        el.style.color = "white";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.fontSize = "12px";
        el.style.fontWeight = "800";
        el.style.boxShadow = "0 8px 20px rgba(0,0,0,.25)";
        el.textContent = String(idx + 1);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([p.lng, p.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    },
    [clearMarkers]
  );

  const fetchRoute = useCallback(
    async (pts) => {
      const token = import.meta.env.VITE_MAPBOX_TOKEN;
      if (!token) throw new Error("Falta VITE_MAPBOX_TOKEN en .env");

      const coords = pts.map((p) => `${p.lng},${p.lat}`).join(";");
      const url =
        `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coords}` +
        `?geometries=geojson&overview=full&steps=false&access_token=${token}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Directions API: ${res.status}`);
      const data = await res.json();

      const r = data?.routes?.[0];
      if (!r?.geometry) throw new Error("No se recibió ruta");

      return {
        geojsonLine: { type: "Feature", geometry: r.geometry, properties: {} },
        distanceKm: r.distance / 1000,
        durationMin: r.duration / 60,
      };
    },
    [profile]
  );

  // FIX: evitar "stale waypoints" usando actualización funcional
  const addWaypoint = useCallback(
    (lng, lat) => {
      setWaypoints((prev) => {
        const next = [...prev, { lng, lat }];

        const map = mapRef.current;
        drawWaypointMarkers(map, next);

        if (next.length >= 2) {
          (async () => {
            try {
              setError(null);
              const planned = await fetchRoute(next);
              setRoute(planned);
              ensurePlannerLayer(map);
              setRouteOnMap(map, planned.geojsonLine);
            } catch (e) {
              setError(e);
            }
          })();
        }

        return next;
      });
    },
    [drawWaypointMarkers, ensurePlannerLayer, fetchRoute, mapRef, setRouteOnMap]
  );

  const clear = useCallback(() => {
    setWaypoints([]);
    setRoute(null);
    setError(null);

    const map = mapRef.current;
    clearMarkers();
    ensurePlannerLayer(map);
    setRouteOnMap(map, null);
  }, [clearMarkers, ensurePlannerLayer, mapRef, setRouteOnMap]);

  const attachMapClick = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    ensurePlannerLayer(map);

    // evita dobles listeners
    if (clickHandlerRef.current) map.off("click", clickHandlerRef.current);

    
    
    const handler = (e) => addWaypoint(e.lngLat.lng, e.lngLat.lat);
    clickHandlerRef.current = handler;
    map.on("click", handler);
  }, [addWaypoint, ensurePlannerLayer, mapRef]);




  const detachMapClick = useCallback(() => {
    const map = mapRef.current;
    if (!map || !clickHandlerRef.current) return;
    map.off("click", clickHandlerRef.current);
    clickHandlerRef.current = null;
  }, [mapRef]);

 
 
  const summary = useMemo(() => {
  if (!route) return { distanceKm: 0, durationMin: 0, geojsonLine: null };
  return {
    distanceKm: route.distanceKm,
    durationMin: route.durationMin,
    geojsonLine: route.geojsonLine,
  };
}, [route]);
  
  
  
  return { waypoints, route, summary, error, clear, attachMapClick, detachMapClick };
}
