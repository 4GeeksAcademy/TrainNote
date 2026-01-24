const STORAGE_KEY = "trail_routes"; 
export function getRoutes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveRoute(route) {
  const prev = getRoutes();
  const next = [route, ...prev];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next; 
}

export function deleteRoute(id) {
  const prev = getRoutes();
  const next = prev.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next; 
}

export function clearRoutes() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}

/**
 * Borra una ruta por id
 */
export function deleteRoute(routeId) {
  const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const next = prev.filter(route => route.id !== routeId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
