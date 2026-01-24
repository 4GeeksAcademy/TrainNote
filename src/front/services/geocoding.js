const BASE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";

export async function geocodePlace(query, opts = {}) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!token) throw new Error("Falta VITE_MAPBOX_TOKEN en .env");

  const {
    limit = 1,
    language = "es",
    country = "es",     
    proximity,          
  } = opts;

  const url = new URL(`${BASE_URL}/${encodeURIComponent(query)}.json`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("language", language);
  if (country) url.searchParams.set("country", country);
  if (proximity?.length === 2) url.searchParams.set("proximity", `${proximity[0]},${proximity[1]}`);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Geocoding API: ${res.status}`);
  const data = await res.json();

  const f = data?.features?.[0];
  if (!f) return null;

  return {
    place_name: f.place_name,
    center: f.center, 
    bbox: f.bbox,     
    feature: f,
  };
}
