import { useState } from "react";
import MapView from "../components/Map/MapView";
import RouteRegistrationHeader from "../components/RouteRegistration/RouteRegistrationHeader";
import RouteRegistrationBottomNav from "../components/RouteRegistration/RouteRegistrationBottomNav";
import "../styles/routeRegistration.css";

export default function RouteRegistration() {
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("gravel");

  const handleStart = () => {
    alert("Start registro (pendiente de implementar tracking)");
  };

  const handleMapLoad = (map) => {
    
    requestAnimationFrame(() => map.resize());
    setTimeout(() => map.resize(), 150);
  };

  return (
    <div className="rr-page">
      <MapView
        className="rr-map"
        center={[-0.52, 42.51]}
        zoom={12}
        onMapLoad={handleMapLoad}
      />

      <div className="rr-overlay-top">
        <RouteRegistrationHeader
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      <RouteRegistrationBottomNav onStart={handleStart} />
    </div>
  );
}
