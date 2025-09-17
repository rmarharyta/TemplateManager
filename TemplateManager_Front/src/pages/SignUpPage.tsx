import React from "react";
import { useState } from "react";
import { Box, Link, useMediaQuery, useTheme } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAuth from "../utils/Contexts/useAuth";
import UserName from "../components/UserName";
import WelcomeText from "../components/WelcomeText";
import PasswordRegister from "../components/PasswordRegister";
import CustomButton from "../components/СustomButton";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
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

  const doPasswordsMatch = password === repeatPassword;

  const isButtonDisabled =
    !isValidEmail(username) || !isValidPassword(password) || !doPasswordsMatch;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => auth.signup(username, password),
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
            <PasswordRegister
              valueFirst={password}
              valueSecond={repeatPassword}
              onChangeFirst={setPassword}
              onChangeSecond={setRepeatPassword}
              isSubmitted={isSubmitted}
            />
          </Box>

          <CustomButton
            text={isPending ? "Waiting..." : "Sign Up"}
            color="primary"
            disabled={isButtonDisabled}
            onClick={() => {
              setIsSubmitted(true);
              if (!isButtonDisabled) mutate();
            }}
          />

          {error && (
            <Box sx={{ color: "red", mt: 1, textAlign: "center" }}>{error}</Box>
          )}

          <Link
            textAlign="center"
            width={1}
            href="/"
            underline="hover"
            color="#440464"
            fontSize={isMobile ? "12px" : "16px"}
          >
            Go back
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default SignUpPage;
