import api from "@/lib/queryClient";

interface AdminUser {
  id: number;
  email: string;
  username: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  userEmail: string;
}

async function fetchUser(): Promise<AdminUser | null> {
  try {
    const response = await api.get("/auth/admin");
    return response.data;
  } catch (err: any) {
    if (err?.response?.status === 401) {
      return null;
    }
    throw err;
  }
}

async function login({ email, password }: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (err: any) {
    if (err?.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error("Login failed.");
  }
}

async function logout() {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (err: any) {
    if (err?.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error("Logout failed.");
  }
}

export function useAuth() {
  return {
    login,
    fetchUser,
    logout,
  };
}
