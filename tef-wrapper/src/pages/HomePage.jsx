import { Fade, Box, Container } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TerraExplorerControls from "../components/TerraExplorerControls";
import WeatherPanel from "../components/WeatherPanel";
import Legend from "../components/Legend";

export default function HomePage() {
  const iframeRef = useRef(null);
  const [sgWorld, setSgWorld] = useState(null);
  const [showLegend, setShowLegend] = useState(true);
  const [iframeWindow, setIframeWindow] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);

  useEffect(() => {
    if (!iframeLoaded) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 300; // 300 * 200ms = 60s

    const tick = () => {
      if (cancelled) return;
      attempts++;

      try {
        const win = iframeRef.current?.contentWindow;
        const SGWorld = win?.SGWorld;

        if (SGWorld?.Creator) {

          // this shows the legend when the flood risk layer is turned on
          SGWorld.AttachEvent("OnProjectTreeAction", (id, action) => {    
            const itemID = id;
            const actionCode = action.Code;

            if (actionCode == 19){
              const itemName = SGWorld.ProjectTree.GetItemName(itemID);
              if (itemName == "Flood Risk Model"){
                const layerVis = SGWorld.ProjectTree.GetVisibility(itemID);

                switch (layerVis){
                  // layer was on and about to be turned off
                  case 1:
                    setShowLegend(false);
                    break;
                  // this means the layer was off and is about to be turned on
                  case 0:
                    setShowLegend(true);
                    break;
                  default:
                    console.log(`unknown visibility stage: ${layerVis}`);
                }
              }
            }
          });

          setSgWorld(SGWorld);
          setIframeWindow(win);
          console.log("✅ Connected to iframe SGWorld");
          
          return;
        }
      } catch (e) {
        console.warn("Error accessing iframe SGWorld:", e);
      }

      if (attempts < maxAttempts) {
        setTimeout(tick, 200);
      } else {
        console.warn("❌ Timed out waiting for SGWorld");
      }
    };

    tick();

    return () => {
      cancelled = true;
    };
  }, [iframeLoaded]);

  const toggleWeather = () => {
    console.log("weather toggled");
    setWeatherOpen((prev) => !prev);
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: "100vh",
        width: "100vw",
        p: 0,
        m: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          bgcolor: "black",
        }}
      >
        <Box
          component="iframe"
          ref={iframeRef}
          id="tefFrame"
          src="https://athens.tracemark.com/TEF/TE.html?project=https://athens.tracemark.com/projects/AthensFloodMap"
          allow="cross-origin-isolated"
          onLoad={() => setIframeLoaded(true)}
          sx={{
            border: "none",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          display: "flex",
          gap: 1,                  // spacing between buttons
          // backdropFilter: "blur(10px)",
          // background: "rgba(20,20,20,0.65)",
          // border: "1px solid rgba(255,255,255,0.1)",
          // borderRadius: 2,
          // padding: 1,
          zIndex: 5,
        }}
      >
        <TerraExplorerControls
          sgWorld={sgWorld}
          iframeWindow={iframeWindow}
          toggleWeather={toggleWeather}
          weatherOpen={weatherOpen}
        />

        <Fade in={weatherOpen} timeout={300} mountOnEnter unmountOnExit>
          <div>
            <WeatherPanel toggleWeather={toggleWeather} sgWorld={sgWorld} />
          </div>
        </Fade>

      </Box>

      <Fade in={showLegend} timeout={300} mountOnEnter unmountOnExit>
        <div>
          <Legend />
        </div>
      </Fade>

      <Box
        sx={{position: "absolute", bottom: 4, left: 12, gap: 1, display: "flex", zIndex: 5,}}
      >
        <img 
          src="https://athens.tracemark.com/app/google_logo.svg" 
          alt="google logo"
          style={{ height: 32, width: "auto"}}
        /> 
      </Box>

    </Container>
  );
}
