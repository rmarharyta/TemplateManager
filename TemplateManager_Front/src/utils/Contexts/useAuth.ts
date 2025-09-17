import { useContext } from "react";
import { UserContext, UserContextType } from "./UserContext";

export default function useAuth() {
    const ctx = useContext(UserContext) as UserContextType;
    if (!ctx)
        throw Error("useAuth must be called under UserProvider")
    return ctx;
}