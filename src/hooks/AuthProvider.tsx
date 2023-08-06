import type { ReactNode } from "react";
import type { User } from "@prisma/client";
import { AuthContext } from "@/hooks/useAuth";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const userLocalStorageKey = "user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<User | null>(
    userLocalStorageKey,
    undefined
  );

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
