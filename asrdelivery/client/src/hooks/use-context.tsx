import { createContext} from "react";

// type AuthContextType = {
//   user: string;
// };

export const AuthContext = createContext<string | null>(null);

// export const ContextProvider = ({ children }: { children: ReactNode }) => {
//   const [userEmail, setUser] = useState<string | null>(null);
//   if(!userEmail){
//     setUser("joel");
//   }
//   return (
//     <AuthContext.Provider value={{ userEmail, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };