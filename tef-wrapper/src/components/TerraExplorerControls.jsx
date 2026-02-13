import { Button, Stack, Typography } from "@mui/material";

function TerraExplorerControls({ sgWorld, iframeWindow }) {
  const connected = !!sgWorld;

  const flyToAltitude = () => {
    if (!sgWorld) return;

    const pos = sgWorld.Navigate.GetPosition();
    pos.Altitude = 1000;
    sgWorld.Navigate.FlyTo(pos, 0);
  };

  const openProjectTree = () => {
    iframeWindow.$('#LayersBtn').trigger('click');
    iframeWindow.$('#layersButtonState2').trigger('click');
  }

  const openMeasureTool = () => {
    iframeWindow.analysis.openAnalysisToolURL({
      name: "distanceMeasurement",
      url: "https://sgs.ngis.com.au/TEF/Tools/DistanceMeasurement/distanceMeasurement.html",
      title: "Distance Measurment"
    });
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        {connected ? "TerraExplorer: Connected" : "TerraExplorer: Connecting..."}
      </Typography>

      <Button variant="outlined" size="small" onClick={flyToAltitude} disabled={!connected}>
        Fly to 1000m
      </Button>

      <Button
        variant="contained"
        size="small"
        disabled={!connected}
        onClick={openProjectTree}
      >
        Open Project Tree
      </Button>

      <Button
        variant="contained"
        size="small"
        disabled={!connected}
        onClick={openMeasureTool}
      >
        Measure Tool
      </Button>
    </Stack>
  );
}

export default TerraExplorerControls;

