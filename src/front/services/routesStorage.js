// ============================================
// ROUTES STORAGE SERVICE
// ============================================
// ⚠️ TEMPORAL: localStorage
// 🔁 FUTURO: API REST (Flask)
// ============================================

const STORAGE_KEY = "trail_routes";

/**
 * Guarda una ruta (planned o recorded)
 */
export function saveRoute(route) {
  const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const next = [route, ...prev];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return route;
}

/**
 * Devuelve todas las rutas guardadas
 */
export function getRoutes() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

/**
 * Borra todas las rutas (solo dev)
 */
export function clearRoutes() {
  localStorage.removeItem(STORAGE_KEY);
}
