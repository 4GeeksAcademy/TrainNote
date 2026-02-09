import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { haversineMeters, gainLossMeters } from "../utils/geo";

const ROUTE_SOURCE_ID = "rr-route";
const ROUTE_LAYER_ID = "rr-route-line";

const buildLineFeature = (points) => ({
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: points.map((p) => [p.lng, p.lat]),
  },
  properties: {},
});

export default function useRouteRecorder(mapRef) {
  const [isRecording, setIsRecording] = useState(false);
  const [points, setPoints] = useState([]);
  const [currentPos, setCurrentPos] = useState(null);
  const [error, setError] = useState(null);

  const watchIdRef = useRef(null);
  const userMarkerRef = useRef(null);

  const metrics = useMemo(() => {
    if (points.length < 2) return { distanceKm: 0, gainM: 0 };

    const distanceMeters = points
      .slice(1)
      .reduce((acc, p, i) => acc + haversineMeters(points[i], p), 0);

    const { gain } = gainLossMeters(points);

    return {
      distanceKm: distanceMeters / 1000,
      gainM: Math.round(gain),
    };
  }, [points]);

  const geojsonLine = useMemo(() => buildLineFeature(points), [points]);

  const stopWatch = useCallback(() => {
    if (watchIdRef.current == null) return;
    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
  }, []);

  const ensureRouteLayer = useCallback((map) => {
    if (!map) return;

    if (!map.getSource(ROUTE_SOURCE_ID)) {
      map.addSource(ROUTE_SOURCE_ID, {
        type: "geojson",
        data: buildLineFeature([]),
      });
    }

    if (map.getLayer(ROUTE_LAYER_ID)) return;

    map.addLayer({
      id: ROUTE_LAYER_ID,
      type: "line",
      source: ROUTE_SOURCE_ID,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-width": 5,
        "line-opacity": 0.9,
        "line-color": "#f3c247",
      },
    });
  }, []);

  const updateRouteOnMap = useCallback((map, pts) => {
    const src = map?.getSource?.(ROUTE_SOURCE_ID);
    if (!src) return;
    src.setData(buildLineFeature(pts));
  }, []);

  const upsertUserMarker = useCallback((map, lng, lat) => {
    if (!map) return;

    const lngLat = [lng, lat];

    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat(lngLat);
      return;
    }

    userMarkerRef.current = new mapboxgl.Marker({ color: "#1E88E5" })
      .setLngLat(lngLat)
      .addTo(map);
  }, []);

  const start = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocalización no soportada");
      return;
    }

    stopWatch();
    setPoints([]);
    setIsRecording(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { longitude, latitude, altitude } = pos.coords;

        setCurrentPos({ lng: longitude, lat: latitude, alt: altitude ?? null });

        const map = mapRef.current;
        upsertUserMarker(map, longitude, latitude);
        ensureRouteLayer(map);

        setPoints((prev) => {
          const next = [
            ...prev,
            { lng: longitude, lat: latitude, alt: altitude ?? null },
          ];

          updateRouteOnMap(map, next);

          map?.easeTo({
            center: [longitude, latitude],
            zoom: Math.max(map.getZoom(), 14),
            duration: 250,
          });

          return next;
        });
      },
      (err) => {
        console.error(err);
        setError(err.message);
        setIsRecording(false);
        stopWatch();
      },
      { enableHighAccuracy: true }
    );
  }, [ensureRouteLayer, mapRef, stopWatch, updateRouteOnMap, upsertUserMarker]);

  const stop = useCallback(() => {
    setIsRecording(false);
    stopWatch();
  }, [stopWatch]);

  const toggle = useCallback(() => {
    if (isRecording) {
      stop();
      return;
    }
    start();
  }, [isRecording, start, stop]);

  const onMapReady = useCallback(
    (map) => {
      ensureRouteLayer(map);
    },
    [ensureRouteLayer]
  );

  useEffect(() => stopWatch, [stopWatch]);

  return {
    isRecording,
    points,
    currentPos,
    metrics,
    geojsonLine,
    error,
    toggle,
    onMapReady,
  };
}
