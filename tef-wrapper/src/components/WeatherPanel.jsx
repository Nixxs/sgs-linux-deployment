import { Box, IconButton } from "@mui/material";

function WeatherPanel({ toggleWeather }) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "52px",
        left: "2px",
        width: 360,
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
        7 Day Weather Forecast

        <IconButton size="small" onClick={toggleWeather}>
          ✕
        </IconButton>
      </Box>

      {/* Content Placeholder */}
      <Box sx={{ padding: 2 }}>
        Weather content will go here...
      </Box>
    </Box>
  );
}

export default WeatherPanel;
