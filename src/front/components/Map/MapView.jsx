import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function MapView({
  center = [-3.7038, 40.4168],
  zoom = 12,
  className = "",
  onMapLoad,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      console.error("Falta VITE_MAPBOX_TOKEN en el .env");
      return;
    }
    mapboxgl.accessToken = token;

    if (mapRef.current) return; 

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12", 
      center,
      zoom,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    mapRef.current.on("load", () => {
      onMapLoad?.(mapRef.current);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainerRef} className={className} />;
}
