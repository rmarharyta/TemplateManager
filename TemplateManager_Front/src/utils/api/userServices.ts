import { azAZ } from "@mui/material/locale";
import axiosInstance from "./axios";

type LoginResponse = {
    token: string,
    returnedUserId: string,
}

export const register = async (email: string, password: string) :Promise<LoginResponse> => {
    try {
        if (!email || !password) throw new Error("email and password are required");
        const user = {email, password };
        const response = await axiosInstance.post("/User/Register", user);
        return response.data as LoginResponse;
    } catch (error) {
        console.error(error)
        throw error;   
    }
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        if (!email || !password) throw new Error("email and password are required");
        const user = { Email: email, Password: password };
        const response = await axiosInstance.post("/User/Login", user);
        return response.data as LoginResponse;
    } catch (error) {
        console.error(error)
        throw error;
    }
}
export const logout = async () => {
    try {
        await axiosInstance.post(`/User/Logout`);
    } catch (e) {
        console.error(e);
    }
}

export const getUserDetails = async (): Promise<string> => {
    try {
        const response = await axiosInstance.get(`/User/me`);
        const data = response.data as { id: string };
        return data.id;
    } catch (e) {
        console.error(e as Error);
        throw e;
    }
}