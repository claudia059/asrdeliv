import api from "@/lib/queryClient";

interface AdminUser {
  id: number;
  email: string;
  username: string;
}

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

function removeToken(): void {
  localStorage.removeItem("auth_token");
}

async function fetchUser(): Promise<AdminUser | null> {
  // const token = getToken();

  // if (!token) {
  //   return null;
  // }

  const response = await api.get("/auth/admin");

  if (response.status === 401) {
    removeToken();
    return null;
  }

  if (!response) {
    throw new Error(`${response}: ${response}`);
  }

  return response.data;
}

async function login(email: string, password: string){
  try{
    const response = await api.post("/auth/login", { email, password });
    if(response.status !== 200){
      console.log("error: " + response.data?.message);
      return response;
    }
    const { token } = await response.data;
    setToken(token);
  
    return response.data;
  }catch(err){
    console.log("AsRerror: " + err);
    return;
  }


}

async function logout() {
  const token = getToken();
  if (token) {
   const r = await api.post("/auth/logout");
   if(r){
    return r.data;
   }
  }
  removeToken();
}

export function useAuth() {
  // const queryClient = useQueryClient();
  // const { data: user, isLoading } = useQuery<AdminUser | null>({
  //   queryKey: ["/api/auth/user"],
  //   queryFn: fetchUser,
  //   retry: false,
  //   staleTime: 1000 * 60 * 5, // 5 minutes
  // });

  // const loginMutation = useMutation({
  //   mutationFn: ({ email, password }: { email: string; password: string }) =>
  //     login(email, password),
  //   onSuccess: (data) => {
  //     queryClient.setQueryData(["/api/auth/user"], data);
  //   },
  // });

  // const logoutMutation = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => {
  //     queryClient.setQueryData(["/api/auth/user"], null);
  //   },
  // });

  return {
    login, fetchUser, logout
    // isLoading,/
    // isAuthenticated: !!user,
    // login: (creds: { email: string; password: string }) => loginMutation.mutateAsync(creds),
    // isLoggingIn: loginMutation.isPending,
    // logout: () => logoutMutation.mutate(),
    // isLoggingOut: logoutMutation.isPending,
  };
}
