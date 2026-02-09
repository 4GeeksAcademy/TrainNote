export const POI_SRC = {
  fuel: "poi-fuel-src",
  food: "poi-food-src",
  hospital: "poi-hospital-src",
  bike: "poi-bike-src",
};

export const POI_LYR = {
  fuel: "poi-fuel-lyr",
  food: "poi-food-lyr",
  hospital: "poi-hospital-lyr",
  bike: "poi-bike-lyr",
};

const KEYS = Object.keys(POI_SRC);

const colorByKey = (key) => {
  if (key === "fuel") return "orange";
  if (key === "food") return "green";
  if (key === "hospital") return "red";
  return "blue";
};

const emptyFC = () => ({ type: "FeatureCollection", features: [] });

const toPointFC = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return emptyFC();

  return {
    type: "FeatureCollection",
    features: items.map((it) => ({
      type: "Feature",
      properties: { id: it.id, name: it.name },
      geometry: {
        type: "Point",
        coordinates: [it.lon, it.lat],
      },
    })),
  };
};

export const upsertNearbyServicesLayers = (
  map,
  services,
  enabledKeys = KEYS
) => {
  if (!map || !services) return;
  if (!map.isStyleLoaded?.()) return;

  KEYS.forEach((key) => {
    const srcId = POI_SRC[key];
    const layerId = POI_LYR[key];
    const isEnabled = enabledKeys.includes(key);

    const data = isEnabled ? toPointFC(services[key]) : emptyFC();

    if (!map.getSource(srcId)) {
      map.addSource(srcId, { type: "geojson", data });
    } else {
      map.getSource(srcId).setData(data);
    }

    if (map.getLayer(layerId)) return;

    map.addLayer({
      id: layerId,
      type: "circle",
      source: srcId,
      paint: {
        "circle-radius": 6,
        "circle-opacity": 0.9,
        "circle-color": colorByKey(key),
        "circle-stroke-width": 2,
        "circle-stroke-color": "#111827",
      },
    });
  });
};

export const removeNearbyServicesLayers = (map) => {
  if (!map) return;

  KEYS.forEach((key) => {
    const layerId = POI_LYR[key];
    const srcId = POI_SRC[key];

    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(srcId)) map.removeSource(srcId);
  });
};
