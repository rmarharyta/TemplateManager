import React, { useState } from "react";
import {
  Box,
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
  valueFirst: string;
  valueSecond: string;
  onChangeFirst: (value: string) => void;
  onChangeSecond: (value: string) => void;
  isSubmitted: boolean;
}

const PasswordRegister = ({
  valueFirst,
  valueSecond,
  onChangeFirst,
  onChangeSecond,
  isSubmitted,
}: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isTouchedFirst, setIsTouchedFirst] = useState(false);
  const [isTouchedSecond, setIsTouchedSecond] = useState(false);

  const [showPasswordFirst, setShowPasswordFirst] = useState(false);
  const [showPasswordSecond, setShowPasswordSecond] = useState(false);

  const isValidPassword = (password: string) => {
    const lengthCondition = password.length >= 6;
    const digitCondition = /\d/.test(password); // At least one digit
    const uppercaseCondition = /[A-Z]/.test(password); // At least one uppercase letter
    return lengthCondition && digitCondition && uppercaseCondition;
  };

  const handlePasswordFirst = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFirst(event.target.value);
  };

  const handlePasswordSecond = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeSecond(event.target.value);
  };

  const handleBlurFirst = () => {
    setIsTouchedFirst(true);
  };
  const handleBlurSecond = () => {
    setIsTouchedSecond(true);
  };

  const handleClickShowPasswordFirst = () => {
    setShowPasswordFirst((show) => !show);
  };
  const handleClickShowPasswordSecond = () => {
    setShowPasswordSecond((show) => !show);
  };

  return (
    <Box
      width={1}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        rowGap: isMobile ? 1.5 : 2,
      }}
    >
      <FormControl
        variant="outlined"
        error={
          (isTouchedFirst && !isValidPassword(valueFirst)) ||
          (isSubmitted && !isValidPassword(valueFirst))
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
          type={showPasswordFirst ? "text" : "password"}
          value={valueFirst}
          onChange={handlePasswordFirst}
          onBlur={handleBlurFirst}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPasswordFirst ? "hide the password" : "show the password"
                }
                onClick={handleClickShowPasswordFirst}
                edge="end"
              >
                {showPasswordFirst ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
        {isTouchedFirst && !isValidPassword(valueFirst) && (
          <FormHelperText>
            Password must be at least 6 characters long, contain at least 1
            digit and 1 uppercase letter.
          </FormHelperText>
        )}
      </FormControl>

      {/* Second Password Field */}
      <FormControl
        variant="outlined"
        error={
          (isTouchedSecond && !isValidPassword(valueSecond)) ||
          (isTouchedFirst && isTouchedSecond && valueFirst !== valueSecond) ||
          (isSubmitted && !isValidPassword(valueSecond))
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
        <InputLabel htmlFor="outlined-repeat-password">
          Repeat password
        </InputLabel>
        <OutlinedInput
          id="outlined-repeat-password"
          type={showPasswordSecond ? "text" : "password"}
          value={valueSecond}
          onChange={handlePasswordSecond}
          onBlur={handleBlurSecond}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPasswordSecond ? "hide the password" : "show the password"
                }
                onClick={handleClickShowPasswordSecond}
                edge="end"
              >
                {showPasswordSecond ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Repeat Password"
        />
        {((isTouchedSecond && !isValidPassword(valueSecond)) ||
          (isTouchedFirst &&
            isTouchedSecond &&
            valueFirst !== valueSecond)) && (
          <FormHelperText>
            {valueFirst !== valueSecond
              ? "Passwords must be the same."
              : "Password must be valid."}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

export default PasswordRegister;
