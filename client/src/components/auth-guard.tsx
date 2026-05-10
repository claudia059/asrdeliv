import React from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!isLoading && !token) {
      setLocation("/admin/login");
    }
  }, [isLoading, token, setLocation]);

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
