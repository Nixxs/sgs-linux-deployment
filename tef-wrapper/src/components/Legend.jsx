import { Box, Typography } from "@mui/material";

const legendItems = [
  { label: "5 - Very Low Risk", color: "#3399ff" },
  { label: "4 - Low Risk", color: "#FFFF00" },
  { label: "3 - Moderate Risk", color: "#FFA500" },
  { label: "2 - High Risk", color: "#FF0000" },
  { label: "1 - Very High Risk", color: "#800000" },
];

function Legend() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 12,
        right: 12,
        width: 181,
        borderRadius: 2,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        overflow: "hidden",
        zIndex: 6,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.2,
          backgroundColor: "#f2f2f2",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>
          Flood Risk Legend
        </Typography>
      </Box>

      {/* Body */}
      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(4px)",
          px: 2,
          py: 1.5,
        }}
      >
        {legendItems.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 22,
                height: 22,
                backgroundColor: item.color,
                border: "1px solid #444",
                borderRadius: "2px",
                mr: 1.5,
              }}
            />

            <Typography variant="body2">
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Legend;
