import { useMutation } from "@tanstack/react-query";
import useAuth from "../Contexts/useAuth";

export function useLogout() {
    const auth = useAuth();
  
    return useMutation({
      mutationFn: async () => {
        await auth.logout();
      },
    });
  }