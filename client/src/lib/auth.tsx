import { createContext, useContext, useEffect, useState } from "react";
import type { AdminUser } from "@/lib/api-client-react/src";
import { useGetMe, setAuthTokenGetter } from "@/lib/api-client-react/src";

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

setAuthTokenGetter(() => localStorage.getItem("asr_token"));

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("asr_token"));
  const [user, setUser] = useState<AdminUser | null>(null);

  const { data: me, isLoading, error } = useGetMe({
    query: { enabled: !!token, retry: false },
  });

  useEffect(() => {
    if (me) setUser(me);
  }, [me]);

  useEffect(() => {
    if (error) logout();
  }, [error]);

  const login = (newToken: string, newUser: AdminUser) => {
    localStorage.setItem("asr_token", newToken);
    setAuthTokenGetter(() => localStorage.getItem("asr_token"));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("asr_token");
    setAuthTokenGetter(() => null);
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/asr/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading: isLoading && !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
