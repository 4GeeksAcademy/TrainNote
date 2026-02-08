import math
import time
import hashlib
import threading
import requests

OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.nchc.org.tw/api/interpreter",
]

_CACHE = {}
_CACHE_LOCK = threading.Lock()

_LAST_CALL_TS = 0.0
_LAST_CALL_LOCK = threading.Lock()


def _cooldown(min_seconds=2.5):
    global _LAST_CALL_TS
    with _LAST_CALL_LOCK:
        now = time.time()
        delta = now - _LAST_CALL_TS
        if delta < min_seconds:
            time.sleep(min_seconds - delta)
        _LAST_CALL_TS = time.time()


def _cache_get(key):
    now = time.time()
    with _CACHE_LOCK:
        item = _CACHE.get(key)
        if not item:
            return None
        exp, value = item
        if now > exp:
            _CACHE.pop(key, None)
            return None
        return value


def _cache_set(key, value, ttl_seconds=60):
    exp = time.time() + ttl_seconds
    with _CACHE_LOCK:
        _CACHE[key] = (exp, value)


def _hash_key(payload: str) -> str:
    return hashlib.sha1(payload.encode("utf-8")).hexdigest()


def _meters_to_deg_lat(m):
    return m / 111_320.0


def _meters_to_deg_lng(m, lat_deg):
    return m / (111_320.0 * max(0.2, math.cos(math.radians(lat_deg))))


def _route_bbox(coords_lnglat, buffer_m=300):
    lngs = [c[0] for c in coords_lnglat]
    lats = [c[1] for c in coords_lnglat]
    min_lng, max_lng = min(lngs), max(lngs)
    min_lat, max_lat = min(lats), max(lats)

    mid_lat = (min_lat + max_lat) / 2.0
    dlat = _meters_to_deg_lat(buffer_m)
    dlng = _meters_to_deg_lng(buffer_m, mid_lat)

    south = min_lat - dlat
    north = max_lat + dlat
    west = min_lng - dlng
    east = max_lng + dlng
    return (south, west, north, east)


def _build_overpass_query_bbox(south, west, north, east):
    return f"""
[out:json][timeout:25];
(
  node({south},{west},{north},{east})["amenity"="fuel"];
  node({south},{west},{north},{east})["amenity"="hospital"];
  node({south},{west},{north},{east})["shop"="bicycle"];

  node({south},{west},{north},{east})["shop"="supermarket"];
  node({south},{west},{north},{east})["shop"="convenience"];
  node({south},{west},{north},{east})["amenity"="restaurant"];
  node({south},{west},{north},{east})["amenity"="cafe"];
  node({south},{west},{north},{east})["amenity"="fast_food"];
);
out body;
"""


def _map_element(el):
    tags = el.get("tags") or {}
    name = tags.get("name") or tags.get("brand") or "Sin nombre"
    return {
        "id": f"{el.get('type')}/{el.get('id')}",
        "name": name,
        "lat": float(el.get("lat")),
        "lon": float(el.get("lon")),
        "tags": tags,
    }


def _bucketize(elements):
    out = {"fuel": [], "food": [], "hospital": [], "bike": []}
    seen = set()

    for el in elements:
        if el.get("type") != "node":
            continue
        if el.get("lat") is None or el.get("lon") is None:
            continue

        item = _map_element(el)
        if item["id"] in seen:
            continue
        seen.add(item["id"])

        tags = item.get("tags") or {}
        amenity = tags.get("amenity")
        shop = tags.get("shop")

        if amenity == "fuel":
            out["fuel"].append(item)
            continue
        if amenity == "hospital":
            out["hospital"].append(item)
            continue
        if shop == "bicycle":
            out["bike"].append(item)
            continue

        if shop in ("supermarket", "convenience") or amenity in ("restaurant", "cafe", "fast_food"):
            out["food"].append(item)
            continue

    return {
        k: [{"id": x["id"], "name": x["name"], "lat": x["lat"], "lon": x["lon"]} for x in out[k]]
        for k in out
    }


def _post_overpass(query: str):
    session = requests.Session()
    last_err = None

    for url in OVERPASS_ENDPOINTS:
        try:
            res = session.post(url, data=query.encode("utf-8"), timeout=35)

            if res.status_code in (429, 502, 503, 504):
                last_err = RuntimeError(f"Overpass {res.status_code} en {url}")
                continue

            res.raise_for_status()
            data = res.json()
            return data.get("elements", []) or []
        except Exception as e:
            last_err = e
            continue

    raise last_err if last_err else RuntimeError("No Overpass endpoint available")


def get_nearby_services_for_route(geojson_feature, radius_m=300, cache_ttl=60):
    geom = (geojson_feature or {}).get("geometry") or {}
    coords = geom.get("coordinates") or []

    if not isinstance(coords, list) or len(coords) < 2:
        return {"fuel": [], "food": [], "hospital": [], "bike": []}

    rounded = [(round(c[0], 5), round(c[1], 5)) for c in coords]
    cache_key = _hash_key(f"r={radius_m}|coords={rounded[:60]}|n={len(rounded)}")

    cached = _cache_get(cache_key)
    if cached:
        return cached

    _cooldown(2.5)

    south, west, north, east = _route_bbox(coords, buffer_m=radius_m)
    q = _build_overpass_query_bbox(south, west, north, east)

    elements = _post_overpass(q)
    result = _bucketize(elements)

    _cache_set(cache_key, result, ttl_seconds=cache_ttl)
    return result
