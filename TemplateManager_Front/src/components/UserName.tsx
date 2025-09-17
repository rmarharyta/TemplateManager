import React from "react";
import { useState } from "react";
import { TextField, useMediaQuery, useTheme } from "@mui/material";

interface Props {
  value: string;
  onChange: (value: string) => void;
  isSubmitted: boolean;
}

const UserName = ({ value, onChange, isSubmitted }: Props) => {
  const [isTouched, setIsTouched] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  const handleBlur = () => {
    setIsTouched(true); 
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <TextField
      fullWidth
      size={isMobile ? "small" : "medium"}
      sx={{
        backgroundColor: "#D9D9D9",
        marginTop: "22px",
        color: "#565454",
        width: "80vw",
        height: isMobile ? "40px" : "56px",
        maxWidth: "592px",
        fontFamily: "Poppins, sans-serif", 
        fontSize: isMobile ? "15px" : "15px", 
        fontWeight: 400,
        borderRadius: isMobile ? "15px" : "20px", 
        "& .MuiOutlinedInput-root": {
          borderRadius: isMobile ? "15px" : "20px",
          color: "#565454",
          "& fieldset": {
            borderWidth: "1px",
            borderColor: "#08031B", 
          },
          "&:hover fieldset": {
            borderWidth: "2px",
            borderColor: "#08031B", 
          },
          "&.Mui-focused fieldset": {
            borderWidth: "1px", 
          },
        },
      }}
      onChange={handleUsername}
      onBlur={handleBlur} 
      error={
        (isTouched && !isValidEmail(value)) ||
        (isSubmitted && !isValidEmail(value))
      } 
      label="Email"
      value={value}
      helperText={
        !isValidEmail(value) && isTouched
          ? "Please enter a valid email address"
          : ""
      }
    />
  );
};

export default UserName;
