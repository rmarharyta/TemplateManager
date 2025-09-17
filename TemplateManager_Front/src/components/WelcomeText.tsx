import React from "react";
import { SxProps, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/material";

function WelcomeText() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const SecTitleStyle: SxProps = {
    color: "#565454",
    fontFamily: "Ledger, sans-serif",
    fontWeight: 400,
    fontSize: isMobile ? "20px" : "36px",
    textAlign: "right",
    lineHeight: 1.1,
  };

  return (
    <Box
      sx={{
        width: "80vw",
        maxWidth: "590px",
      }}
    >
      <Typography
        sx={{
          color: "#08031B",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: isMobile ? "36px" : "64px",
          textAlign: "right",
        }}
      >
        Start work with
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          flexDirection: "column",
        }}
      >
        <Typography sx={SecTitleStyle}>HTML</Typography>
        <Typography sx={SecTitleStyle}>templates manager</Typography>
      </Box>
    </Box>
  );
}

export default WelcomeText;
