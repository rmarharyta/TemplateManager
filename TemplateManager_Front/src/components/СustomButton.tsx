import React from "react";
import { Button, useTheme, useMediaQuery } from "@mui/material";

interface Props {
  text: string; 
  color: string;
  onClick: () => void; 
  disabled?: boolean;
}

function CustomButton({ text, color = "primary", onClick, disabled }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Button
      variant="contained"
      disabled={disabled}
      sx={{
        backgroundColor: color,
        width: isMobile ? "100%" : "200px",
        padding: isMobile ? "8px" : "12px",
        borderRadius: "30px",
      }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}

export default CustomButton;
