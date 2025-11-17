import { authApi } from "@/api/auth-api";
import { axiosClient } from "@/api/axios-client/axios-client";
import { Constant } from "@/app-constants";
import { useStorageState } from "@/hooks/useStorageState";
import { storage } from "@/storage/mmkv";
import { LoginUserDto } from "@/types/LoginUserDto";
import { LoginUserResponseDto } from "@/types/LoginUserResponseDto";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

type AuthContextType = {
  login: (loginData: LoginUserDto) => Promise<LoginUserResponseDto | undefined>;
  logout: () => void;
  session?: string | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  login: () => new Promise((resolve) => resolve(undefined)),
  logout: () => null,
  session: null,
  isLoading: false,
});

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [tempSession, setTempSession] = useState<string | null>(null)
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  useEffect(() => {
    if (!isLoading && session) {
      const exp = JSON.parse(atob(session.split('.')[1])).exp * 1000;
      if (Date.now() > exp) logout();

      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${session}`;
    }
  }, [isLoading, session]);

  const login = async (loginData: LoginUserDto): Promise<LoginUserResponseDto | undefined> => {
    setIsLoadingApi(true);
    try {
      const result = await authApi.loginUser({
        userIdentifier: loginData.userIdentifier,
        password: loginData.password
      })

      const autologinKey = Constant.UserPreferences.UseAutoLogin;
      if (storage.contains(autologinKey) || !!storage.getBoolean(autologinKey)) {
        setSession(result.token);
      } else {
        setTempSession(result.token);
      }
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
      return result;
    } catch {
      return undefined;
    } finally {
      setIsLoadingApi(false);
    }
  };

  const logout = () => {
    const autologinKey = Constant.UserPreferences.UseAutoLogin;
    storage.remove(autologinKey);
    delete axiosClient.defaults.headers.common['Authorization'];
    setSession(null);
    setTempSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        login: login,
        logout: logout,
        session: session ?? tempSession,
        isLoading: isLoading || isLoadingApi,
      }}>
      {children}
    </AuthContext.Provider>
  );
}