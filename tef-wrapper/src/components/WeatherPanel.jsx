import { Box, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import ForecastStrip from "./ForecastStrip";
import CircularProgress from "@mui/material/CircularProgress";

function degToCardinal(deg) {
  if (deg == null) return "";

  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const ix = Math.round(deg / 45) % 8;
  return dirs[ix];
}

function WeatherPanel({ toggleWeather, sgWorld }) {
  const [weatherDays, setWeatherDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      try {
        const sgPosition = sgWorld.Navigate.GetPosition();
        console.log(sgPosition);

        const lat = sgPosition.Y;
        const lon = sgPosition.X;

        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        const days = data.forecastDays || [];

        const parsed = days.slice(0, 7).map((day) => {
          const dateObj = day.displayDate;
          const date = dateObj
            ? `${dateObj.year}-${String(dateObj.month).padStart(2, "0")}-${String(dateObj.day).padStart(2, "0")}`
            : day.interval?.startTime?.slice(0, 10);

          const iconBase = day.daytimeForecast?.weatherCondition?.iconBaseUri;
          const icon = `${iconBase}.svg`
          const condition = day.daytimeForecast?.weatherCondition?.description?.text;

          const min = day.minTemperature?.degrees;
          const max = day.maxTemperature?.degrees;

          const rainPct =
            day.daytimeForecast?.precipitation?.probability?.percent ?? 0;

          const windDeg = day.daytimeForecast?.wind?.direction?.degrees;
          const windCard = degToCardinal(windDeg);

          const windSpeed = day.daytimeForecast?.wind?.speed?.value;
          const windGust = day.daytimeForecast?.wind?.gust?.value;

          const wind =
            windSpeed != null
              ? `${windCard} ${Math.round(windSpeed)} km/h${windGust ? ` (gust ${Math.round(windGust)})` : ""}`
              : null;

          return {
            date,
            icon,
            condition,
            min,
            max,
            rainPct,
            wind,
          };
        });

        console.log("PARSED WEATHER:", parsed);
        setWeatherDays(parsed);

      } catch (err) {
        console.error("Weather fetch failed:", err);
        setWeatherDays([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  return (
    <Box
      sx={{
        position: "absolute",
        top: "52px",
        left: "2px",
        width: 675,
        backgroundColor: "#e9e9e9",
        borderRadius: 2,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        zIndex: 6,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          backgroundColor: "#f2f2f2",
          borderBottom: "1px solid #ddd",
          fontWeight: 600,
        }}
      >
        5 Day Weather Forecast

        <IconButton size="small" onClick={toggleWeather}>
          ✕
        </IconButton>
      </Box>

      {/* Content Placeholder */}
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        {loading ? <CircularProgress /> : <ForecastStrip days={weatherDays} />}
      </Box>
    </Box>
  );
}

export default WeatherPanel;

