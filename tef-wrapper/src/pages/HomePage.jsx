import { Box, Container } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TerraExplorerControls from "../components/TerraExplorerControls";

export default function HomePage() {
  const iframeRef = useRef(null);
  const [sgWorld, setSgWorld] = useState(null);
  const [iframeWindow, setIframeWindow] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

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
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          backdropFilter: "blur(10px)",
          background: "rgba(20,20,20,0.65)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          px: 3,
          zIndex: 5,
        }}
      >
        <TerraExplorerControls sgWorld={sgWorld} iframeWindow={iframeWindow} />
      </Box>
    </Container>
  );
}
