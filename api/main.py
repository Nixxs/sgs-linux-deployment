
import os
import httpx
from fastapi import FastAPI, HTTPException

app = FastAPI()

WEATHER_URL = "https://weather.googleapis.com/v1/forecast/days:lookup"
GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"

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
    api_key = os.getenv("GOOGLE_WEATHER_API_KEY")
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

