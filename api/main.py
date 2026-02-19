import os
import httpx
from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.get("/weather")
async def get_weather(lat: float, lon: float):
    api_key = os.getenv("GOOGLE_WEATHER_API_KEY")

    url = "https://weather.googleapis.com/v1/forecast/days:lookup"
    params = {
        "location.latitude": lat,
        "location.longitude": lon,
        "key": api_key,
    }

    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params)

    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail=r.text)

    return r.json()

