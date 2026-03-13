import { Box, Typography } from "@mui/material";

function ForecastCard({ day }) {
  const dateLabel = day?.date ? day.date.slice(5) : ""; // "MM-DD" quick label

  return (
    <Box
      sx={{
        minWidth: 86,
        flex: "0 0 auto",
        backgroundColor: "#f7f7f7",
        border: "1px solid #ddd",
        borderRadius: 2,
        padding: 1,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>
        {dateLabel}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.5 }}>
        {day?.icon ? (
          <Box
            component="img"
            src={day.icon}
            alt={day?.condition ?? "Weather"}
            sx={{ width: 22, height: 22 }}
          />
        ) : (
          <Box sx={{ width: 22, height: 22 }} />
        )}

        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
          {day?.condition ?? "-"}
        </Typography>
      </Box>

      <Typography sx={{ fontSize: 12, mt: 0.75 }}>
        <b>{day?.max?.toFixed?.(0) ?? "-"}</b>° / {day?.min?.toFixed?.(0) ?? "-"}°
      </Typography>

      <Typography sx={{ fontSize: 11, opacity: 0.85, mt: 0.25 }}>
        Rain: {day?.rainPct ?? 0}%
      </Typography>

      <Typography sx={{ fontSize: 11, opacity: 0.85, mt: 0.25 }}>
        {day?.wind ?? ""}
      </Typography>
    </Box>
  );
}

export default function ForecastStrip({ days = [] }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        paddingBottom: 1,
        "&::-webkit-scrollbar": { height: 8 },
        "&::-webkit-scrollbar-thumb": { background: "#c9c9c9", borderRadius: 8 },
      }}
    >
      {days.map((d) => (
        <ForecastCard key={d.date} day={d} />
      ))}
    </Box>
  );
}

