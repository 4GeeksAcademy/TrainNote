import { useState } from "react";
import MapView from "../components/Map/MapView";
import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl from "mapbox-gl";

const center = [-71.05953, 42.3629];

export default function MapPage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <div
        style={{
          margin: "10px 10px 0 0",
          width: 300,
          right: 0,
          top: 0,
          position: "absolute",
          zIndex: 10,
        }}
      >
        <SearchBox
          accessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          mapboxgl={mapboxgl}
          value={inputValue}
          proximity={center}
          onChange={setInputValue}
          marker
        />
      </div>

      <MapView className="map-container" center={center} />
    </>
  );
}