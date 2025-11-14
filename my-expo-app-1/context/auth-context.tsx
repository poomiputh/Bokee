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

  return (
    <AuthContext.Provider
      value={{
        login: () => {
          // Perform sign-in logic here
          setSession('xxx');
        },
        logout: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}