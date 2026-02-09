import { session } from "./session";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const normalizeRoute = (route) => {
  if (!route || typeof route !== "object") return null;

  const id = route.id || route._id || String(Date.now());
  const name = route.name || route.title || "Ruta sin nombre";

  const createdAt =
    route.createdAt ||
    route.created_at ||
    route.date ||
    new Date().toISOString();

  const coords =
    route.preview_coords ||
    route.coords ||
    route.coordinates ||
    route.geojson?.geometry?.coordinates ||
    route.geojsonFeature?.geometry?.coordinates ||
    route.geojsonLine?.geometry?.coordinates ||
    null;

  return {
    id,
    type: route.type || route.route_type || "planned",
    name,
    terrain: route.terrain || null,
    distance_km: route.distance_km ?? route.distance ?? null,
    duration_min: route.duration_min ?? route.duration ?? null,
    gain_m: route.gain_m ?? null,
    bbox: route.bbox ?? null,
    preview_coords: Array.isArray(coords) ? coords : null,
    created_at: createdAt,
  };
};

const apiFetch = async (path, options = {}) => {
  const token = session.getToken();
  if (!token) throw new Error("No autenticado");
  if (!backendUrl) throw new Error("Falta VITE_BACKEND_URL");

  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  const resp = await fetch(`${backendUrl}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await resp.json();
  } catch {
    data = null;
  }

  if (!resp.ok) {
    throw new Error(data?.msg || `HTTP ${resp.status}`);
  }

  return data;
};

export const getRoutes = async () => {
  const data = await apiFetch("/api/saved-routes");
  return Array.isArray(data) ? data : [];
};

export const getRouteById = async (routeId) => {
  if (!routeId) return null;
  return apiFetch(`/api/saved-routes/${encodeURIComponent(routeId)}`);
};

export const saveRoute = async (route) => {
  const summary = normalizeRoute(route);
  if (!summary) return null;

  return apiFetch("/api/saved-routes", {
    method: "POST",
    body: JSON.stringify(summary),
  });
};

export const deleteRoute = async (routeId) => {
  if (!routeId) return;
  await apiFetch(`/api/saved-routes/${encodeURIComponent(routeId)}`, {
    method: "DELETE",
  });
};

export const clearRoutes = async () => {
  const routes = await getRoutes();
  await Promise.all(routes.map((route) => deleteRoute(route.id)));
  return [];
};
