import { AuthContext } from "@/context/auth-context";
import { use } from "react";

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}