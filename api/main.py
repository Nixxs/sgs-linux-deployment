
import os
import httpx
import asyncio
import json
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException, Query, Response

app = FastAPI()

WEATHER_URL = "https://weather.googleapis.com/v1/forecast/days:lookup"
GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"
PLACES_BASE = "https://places.googleapis.com/v1"

api_key = os.getenv("GOOGLE_WEATHER_API_KEY")

def pick_location_label(geocode_json: dict) -> str | None:
    results = geocode_json.get("results") or []
    if not results:
        return None

    # Prefer a "locality" (city) + admin area (state) style label if possible,
    # otherwise fall back to formatted_address.
    # We'll just use formatted_address for now (simple + good UX).
    return results[0].get("formatted_address")

@app.get("/weather")
async def get_weather(lat: float, lon: float):
    if not api_key:
        raise HTTPException(status_code=500, detail="GOOGLE_WEATHER_API_KEY not set")

    async with httpx.AsyncClient(timeout=20) as client:
        # 1) Weather
        w_params = {
            "location.latitude": lat,
            "location.longitude": lon,
            "key": api_key,
        }
        w = await client.get(WEATHER_URL, params=w_params)

        if w.status_code != 200:
            raise HTTPException(status_code=w.status_code, detail=w.text)

        w_json = w.json()

        # 2) Reverse geocode (for a human label)
        g_params = {
            "latlng": f"{lat},{lon}",
            "key": api_key,
        }
        g = await client.get(GEOCODE_URL, params=g_params)

        location = None
        if g.status_code == 200:
            location = pick_location_label(g.json())

    # Return a small, stable shape for the frontend
    return {
        "location": location,                 # may be null if ocean/remote or geocode fails
        "forecastDays": w_json.get("forecastDays", []),
        "lat": lat,
        "lon": lon,
    }

def _safe_float(x: Any) -> Optional[float]:
    try:
        return float(x)
    except Exception:
        return None

async def places_autocomplete(client: httpx.AsyncClient, q: str, region_code: str = "GR") -> Dict[str, Any]:
    url = f"{PLACES_BASE}/places:autocomplete"
    headers = {
        "X-Goog-Api-Key": api_key,
        # Optional but useful to reduce payload:
        "X-Goog-FieldMask": (
            "suggestions.placePrediction.placeId,"
            "suggestions.placePrediction.text"
        ),
    }
    body = {
        "input": q,
        "regionCode": region_code,          # biases results toward the region
        "includedRegionCodes": [region_code],
        "languageCode": "en",
        # You can add locationBias or locationRestriction too (but not both).
    }

    r = await client.post(url, headers=headers, json=body, timeout=10.0)
    r.raise_for_status()
    return r.json()

async def place_details_location(client: httpx.AsyncClient, place_id: str) -> Dict[str, Any]:
    # Place Details (New): GET /v1/places/{place_id}
    url = f"{PLACES_BASE}/places/{place_id}"
    headers = {
        "X-Goog-Api-Key": api_key,
        # Place Details requires a field mask:
        "X-Goog-FieldMask": "location,displayName,formattedAddress",
    }

    r = await client.get(url, headers=headers, timeout=10.0)
    r.raise_for_status()
    return r.json()

@app.get("/address")
async def get_address(
    q: str = Query(..., min_length=2),
    as_js: bool = Query(True, description="If true, returns fillAutoComplete([...]) as JS string"),
):
    if not api_key:
        return Response("Missing GOOGLE_MAPS_API_KEY", status_code=500)

    async with httpx.AsyncClient() as client:
        ac = await places_autocomplete(client, q=q, region_code="GR")

        suggestions = ac.get("suggestions", [])
        # Take top 5 place predictions
        place_preds = []
        for s in suggestions:
            pp = s.get("placePrediction")
            if pp and pp.get("placeId"):
                place_preds.append(pp)
        place_preds = place_preds[:5]

        # Fetch details in parallel (so it’s not slow)
        details_list = await asyncio.gather(
            *[place_details_location(client, pp["placeId"]) for pp in place_preds],
            return_exceptions=True,
        )

        results: List[Dict[str, Any]] = []
        for pp, det in zip(place_preds, details_list):
            if isinstance(det, Exception):
                continue

            loc = det.get("location", {}) or {}
            lat = _safe_float(loc.get("latitude"))
            lon = _safe_float(loc.get("longitude"))

            # Text shown to user (Autocomplete provides a formatted text object)
            text_obj = (pp.get("text") or {})
            description = text_obj.get("text") or det.get("formattedAddress") or ""
            name = (det.get("displayName") or {}).get("text") or ""

            if lat is None or lon is None:
                continue

            results.append({
                "Name": name or description,
                "Description": description,
                "Lat": lat,
                "Lon": lon,
            })

        if as_js:
            return Response(f"fillAutoComplete({json.dumps(results)});", media_type="application/javascript")
        return results
