import { Box, Container } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TerraExplorerControls from "../components/TerraExplorerControls";
import WeatherPanel from "../components/WeatherPanel";

export default function HomePage() {
  const iframeRef = useRef(null);
  const [sgWorld, setSgWorld] = useState(null);
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

        // Creator tends to appear once fully initialized
        if (SGWorld?.Creator) {
          setSgWorld(SGWorld);
          setIframeWindow(win);
          console.log("✅ Connected to iframe SGWorld");
          return;
        }
      } catch (e) {
        // If this throws, it's usually cross-origin. In your case it should not.
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
          src="https://sgs.ngis.com.au/TEF/TE.html?project=https://sgs.ngis.com.au/Default/projects/AthensFloodMap.47576"
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
        />

        {weatherOpen && (
          <WeatherPanel
            toggleWeather={toggleWeather}
          />
        )}

      </Box>
    </Container>
  );
}
