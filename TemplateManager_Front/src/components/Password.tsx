import React, { useState } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface Props {
  value: string;
  onChange: (value: string) => void;
  isSubmitted: boolean;
}

const Password = ({ value, onChange, isSubmitted }: Props) => {
  const [isTouched, setIsTouched] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const isValidPassword = (password: string) => {
    const lengthCondition = password.length >= 6;
    const digitCondition = /\d/.test(password); // Перевірка на наявність хоча б однієї цифри
    const uppercaseCondition = /[A-Z]/.test(password); // Перевірка на наявність великої літери
    return lengthCondition && digitCondition && uppercaseCondition;
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleBlur = () => {
    setIsTouched(true); // Позначаємо, що користувач завершив введення
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <FormControl
      variant="outlined"
      error={
        (isTouched && !isValidPassword(value)) ||
        (isSubmitted && !isValidPassword(value))
      }
      fullWidth
      size={isMobile ? "small" : "medium"}
      sx={{
        backgroundColor: "#D9D9D9",
        marginTop: "11px",
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
    >
      <InputLabel htmlFor="outlined-password">Password</InputLabel>
      <OutlinedInput
        id="outlined-password"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={handlePassword}
        onBlur={handleBlur}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={
                showPassword ? "hide the password" : "show the password"
              }
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
      {isTouched && !isValidPassword(value) && (
        <FormHelperText>
          Password must be at least 6 characters long, contain at least 1 digit
          and 1 uppercase letter
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default Password;
