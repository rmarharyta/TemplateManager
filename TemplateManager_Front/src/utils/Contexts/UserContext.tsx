import React, { FC, ReactNode, useEffect } from "react";
import { getUserDetails, login, logout, register } from "../api/userServices";
import useAuth from "./useAuth";
import { Navigate } from "react-router-dom";

export type UserContextType = {
  Id: string | undefined;
  signin: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  logout: () => void;
};

export const UserContext = React.createContext<UserContextType | undefined>(
  undefined
);

const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [Id, setId] = React.useState<string>();

  useEffect(() => {
    getUserDetails()
      .then((user) => {
        console.log(user);
        setId(user);
      })
      .catch(() => setId(undefined));
  }, []);

  const signin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      setId(response.returnedUserId);
    } catch (error: any) {
      console.error("Помилка авторизації:", error);
      throw new Error(
        error.response?.data?.message || "Не вдалося авторизуватись"
      );
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await register(email, password);
      setId(response.returnedUserId);
    } catch (error: any) {
      console.error("Помилка реєстрації:", error);
      return Promise.reject(error); // Передаємо помилку далі
    }
  };

  const signout = async () => {
    try {
      await logout();
      setId(undefined);
    } catch (e) {
      console.error("Помилка виходу:", e);
      throw e;
    }
  };

  return (
    <UserContext.Provider value={{ Id, signin, signup, logout: signout }}>
      {children}
    </UserContext.Provider>
  );
};

export const SingedIn: FC<{ children: ReactNode }> = ({ children }) => {
  const { Id } = useAuth();

  if (Id) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
};

export const SingedOut: FC<{ children: ReactNode }> = ({ children }) => {
  const { Id } = useAuth();

  if (!Id) {
    return <>{children}</>;
  } else {
    return <Navigate to="/home" />;
  }
};
export default UserProvider;
