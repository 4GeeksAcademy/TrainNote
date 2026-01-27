import json
import os
from typing import Any, Dict, List, Tuple

# Cache en memoria para no leer el JSON en cada request
_CATALOG_CACHE: List[Dict[str, Any]] | None = None


def _default_catalog_path() -> str:
    """
    Devuelve la ruta absoluta a:
    src/api/data/catalog_bike_models.json

    Este archivo debe existir en tu repo.
    """
    
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    return os.path.join(base_dir, "data", "catalog_bike_models.json")


def load_catalog(path: str | None = None, force_reload: bool = False) -> List[Dict[str, Any]]:
    """
    Carga el catálogo JSON (lista de dicts) y lo cachea.
    """
    global _CATALOG_CACHE

    if _CATALOG_CACHE is not None and not force_reload:
        return _CATALOG_CACHE

    catalog_path = path or _default_catalog_path()
    if not os.path.exists(catalog_path):
        raise FileNotFoundError(f"No existe el catálogo: {catalog_path}")

    with open(catalog_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError("El catálogo debe ser una LISTA de bicis (JSON array)")


    normalized = []
    for item in data:
        if not isinstance(item, dict):
            continue
        if not item.get("id") or not item.get("brand") or not item.get("model"):
            continue
        
        normalized.append(item)

    _CATALOG_CACHE = normalized
    return _CATALOG_CACHE


def rank_bikes(context: Dict[str, Any], catalog: List[Dict[str, Any]], limit: int = 3) -> List[Dict[str, Any]]:
    """
    Ranking simple y defendible:
    - Filtra por type si hay mode
    - Excluye modes / marcas
    - Puntúa por cercanía de precio a budget (o rango min/max)
    - Bonus por marcas preferidas y por tags (si vienen en context)
    Siempre devuelve hasta `limit` resultados.
    """
    ctx = context or {}

    mode = ctx.get("mode")  # modo preferido
    exclude_modes = set(ctx.get("exclude_modes") or [])
    preferred_brands = set([str(b).lower() for b in (ctx.get("preferred_brands") or [])])
    excluded_brands = set([str(b).lower() for b in (ctx.get("excluded_brands") or [])])

    budget = ctx.get("budget")
    budget_min = ctx.get("budget_min")
    budget_max = ctx.get("budget_max")

    
    desired_tags = set([str(t).lower() for t in (ctx.get("tags") or [])])

    def is_allowed(item: Dict[str, Any]) -> bool:
        t = item.get("type")
        if t in exclude_modes:
            return False
        if mode and t != mode:
            return False

        brand = str(item.get("brand") or "").lower()
        if brand in excluded_brands:
            return False

        return True

    filtered = [b for b in catalog if is_allowed(b)]
    if not filtered:
        
        def relaxed(item: Dict[str, Any]) -> bool:
            t = item.get("type")
            if t in exclude_modes:
                return False
            brand = str(item.get("brand") or "").lower()
            if brand in excluded_brands:
                return False
            return True

        filtered = [b for b in catalog if relaxed(b)]

    def price_score(price: float | int | None) -> float:
        """
        Mayor es mejor.
        Si no hay presupuesto, score neutro.
        """
        if price is None:
            return 0.0
        try:
            p = float(price)
        except Exception:
            return 0.0

        
        if budget is not None:
            try:
                b = float(budget)
                diff = abs(p - b)
                return max(0.0, 1000.0 - diff)  
            except Exception:
                pass

         
        if budget_min is not None or budget_max is not None:
            try:
                mn = float(budget_min) if budget_min is not None else None
                mx = float(budget_max) if budget_max is not None else None
                if mn is not None and p < mn:
                    return max(0.0, 500.0 - (mn - p))
                if mx is not None and p > mx:
                    return max(0.0, 500.0 - (p - mx))
                return 700.0  
            except Exception:
                pass

        return 100.0

    def tags_score(item_tags: List[str] | None) -> float:
        if not desired_tags:
            return 0.0
        if not item_tags:
            return 0.0
        item_set = set([str(t).lower() for t in item_tags])
        overlap = len(desired_tags.intersection(item_set))
        return float(overlap * 80.0)

    def brand_score(brand: str) -> float:
        b = (brand or "").lower()
        if not b:
            return 0.0
        if b in preferred_brands:
            return 250.0
        return 0.0

    def type_score(t: str) -> float:
        
        if mode and t == mode:
            return 300.0
        return 0.0

    scored: List[Tuple[float, Dict[str, Any]]] = []
    for item in filtered:
        score = 0.0
        score += type_score(item.get("type"))
        score += price_score(item.get("price_eur"))
        score += brand_score(item.get("brand"))
        score += tags_score(item.get("tags"))
        scored.append((score, item))

    scored.sort(key=lambda x: x[0], reverse=True)
    top = [x[1] for x in scored[: max(1, limit)]]

    
    out = []
    for b in top:
        out.append(
            {
                "id": b.get("id"),
                "brand": b.get("brand"),
                "name": f"{b.get('brand')} {b.get('model')}".strip(),
                "model": b.get("model"),
                "type": b.get("type"),
                "price_eur": b.get("price_eur"),
                "why": b.get("description") or "",
                "url": b.get("product_url") or "",
                "tags": b.get("tags") or [],
            }
        )

    return out
