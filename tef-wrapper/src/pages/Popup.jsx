import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function Popup(){
  const [fid, setFid] = useState(null);

  useEffect (() => {
    const params = new URLSearchParams(window.location.search);
    const paramFid = params.get("fid");

    setFid(paramFid);
  }, []);

  return (
    <Box>
      <Typography>
        fid: {fid}
      </Typography>
      <Typography>
        This popup window is still under construction..
      </Typography>
    </Box>
  );
}

export default Popup;
