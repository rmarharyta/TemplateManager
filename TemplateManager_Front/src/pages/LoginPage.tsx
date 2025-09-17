import React from "react";
import { useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAuth from "../utils/Contexts/useAuth";
import UserName from "../components/UserName";
import Password from "../components/Password";
import WelcomeText from "../components/WelcomeText";
import CustomButton from "../components/СustomButton";

function LoginPage() {
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const auth = useAuth();

  const isValidPassword = (password: string) =>
    password.length >= 6 && /\d/.test(password) && /[A-Z]/.test(password);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isButtonDisabled =
    !isValidEmail(username) || !isValidPassword(password);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => auth.signin(username, password),
    onSuccess: () => navigate("/home"),
    onError: (err: any) => setError(err.message),
  });

  return (
    <Box
      width={1}
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6DFFF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "90vw",
          maxWidth: "700px",
          justifyContent: "center",
          backgroundColor: "#FFFFFFCC",
          borderRadius: isMobile ? "30px" : "60px",
          padding: isMobile ? "20px" : "40px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            alignItems: "center",
            rowGap: isMobile ? 1.5 : 2,
          }}
        >
          <WelcomeText />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              rowGap: isMobile ? 1.5 : 2,
            }}
          >
            <UserName
              value={username}
              onChange={setUsername}
              isSubmitted={isSubmitted}
            />
            <Password
              value={password}
              onChange={setPassword}
              isSubmitted={isSubmitted}
            />
          </Box>

          {/* Логін кнопка */}
          <CustomButton
            text={isPending ? "Waiting..." : "Log in"}
            color="primary"
            disabled={isButtonDisabled}
            onClick={() => {
              setIsSubmitted(true);
              if (!isButtonDisabled) mutate();
            }}
          />

          {/* Сігнап кнопка */}
          <CustomButton
            text="Sign Up"
            color="secondary"
            onClick={() => navigate("/signup")}
          />

          {error && (
            <Box sx={{ color: "red", mt: 1, textAlign: "center" }}>{error}</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
