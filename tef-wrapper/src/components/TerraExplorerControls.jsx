import { Stack, IconButton, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LightModeIcon from "@mui/icons-material/LightMode";
import StraightenIcon from "@mui/icons-material/Straighten";
import CropFreeIcon from "@mui/icons-material/CropFree";
import CloudIcon from "@mui/icons-material/Cloud";

function TerraExplorerControls({ sgWorld, iframeWindow, toggleWeather, weatherOpen }) {
  const connected = !!sgWorld;

  const openProjectTree = () => {
    weatherOpen && toggleWeather();
    iframeWindow.$('#LayersBtn').trigger('click');
    iframeWindow.$('#layersButtonState2').trigger('click');
  }

  const openSearch = () => {
    weatherOpen && toggleWeather();
    iframeWindow.$('#SearchBtn').trigger('click');
  }

  const openMeasureTool = () => {
    weatherOpen && toggleWeather();
    iframeWindow.analysis.openAnalysisToolURL({
      name: "distanceMeasurement",
      url: "https://athens.tracemark.com/TEF/Tools/DistanceMeasurement/distanceMeasurement.html",
      title: "Distance Measurment"
    });
  }

  const openAreaTool = () => {
    weatherOpen && toggleWeather();
    iframeWindow.analysis.openAnalysisToolURL({
      name: "areaMeasurement",
      url: "https://athens.tracemark.com/TEF/Tools/AreaMeasurement/AreaMeasurement.html",
      title: "Area Measurment"
    });
  }

  const openEnvironment = () => {
    weatherOpen && toggleWeather();
    iframeWindow.$('#AnalysisBtn').trigger('click');
    iframeWindow.$('#analysisTabButton1').trigger('click');
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="left"
    >
      <Tooltip title="Search">
        <IconButton
          size="small"
          disabled={!connected}
          onClick={openSearch}
          sx={{
            width: 36,
            height: 36,
            backgroundColor: "rgba(255,255,255,1)",   // subtle dark button base
            color: "#646871",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#1383be",
              color: "#ffffff",
            },
          }}
        >
          <SearchIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Open Project Tree">
        <IconButton
          size="small"
          disabled={!connected}
          onClick={openProjectTree}
          sx={{
            width: 36,
            height: 36,
            backgroundColor: "rgba(255,255,255,1)",   // subtle dark button base
            color: "#646871",
            transition: "all 0.2s ease",

            "&:hover": {
              backgroundColor: "#1383be",
              color: "#ffffff",
            },
          }}
        >
          <AccountTreeIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Shadow Analysis">
        <IconButton
          size="small"
          disabled={!connected}
          onClick={openEnvironment}
          sx={{
            width: 36,
            height: 36,
            backgroundColor: "rgba(255,255,255,1)",   // subtle dark button base
            color: "#646871",
            transition: "all 0.2s ease",

            "&:hover": {
              backgroundColor: "#1383be",
              color: "#ffffff",
            },
          }}
        >
          <LightModeIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Measure Tool">
        <IconButton
          size="small"
          disabled={!connected}
          onClick={openMeasureTool}
          sx={{
            width: 36,
            height: 36,
            backgroundColor: "rgba(255,255,255,1)",   // subtle dark button base
            color: "#646871",
            transition: "all 0.2s ease",

            "&:hover": {
              backgroundColor: "#1383be",
              color: "#ffffff",
            },
          }}
        >
          <StraightenIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Area Tool">
        <IconButton
          size="small"
          disabled={!connected}
          onClick={openAreaTool}
          sx={{
            width: 36,
            height: 36,
            backgroundColor: "rgba(255,255,255,1)",   // subtle dark button base
            color: "#646871",
            transition: "all 0.2s ease",

            "&:hover": {
              backgroundColor: "#1383be",
              color: "#ffffff",
            },
          }}
        >
          <CropFreeIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="5 Day Forecast">
        <IconButton
          size="small"
          onClick={toggleWeather}
          sx={{
            width: 36,
            height: 36,
            backgroundColor: "rgba(255,255,255,1)",
            color: "#646871",
            "&:hover": {
              backgroundColor: "#1383be",
              color: "#fff",
            },
          }}
        >
          <CloudIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export default TerraExplorerControls;

