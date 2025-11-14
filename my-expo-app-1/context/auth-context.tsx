import { authApi } from "@/api/auth-api";
import { axiosClient } from "@/api/axios-client/axios-client";
import { useStorageState } from "@/hooks/useStorageState";
import { createContext, PropsWithChildren } from "react";

type AuthContextType = {
  login: () => void;
  logout: () => void;
  session?: string | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  login: () => null,
  logout: () => null,
  session: null,
  isLoading: false,
});

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  const login = async () => {
    const result = await authApi.loginUser({
      userIdentifier: "papayabun",
      password: "bbruh101"
    });
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
    setSession(result.token);
  };

  const logout = () => {
    delete axiosClient.defaults.headers.common['Authorization'];
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        login: login,
        logout: logout,
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}