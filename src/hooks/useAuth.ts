import type { User } from "@prisma/client";

import { createContext, useContext } from "react";

interface AuthContextProps {
  user: User | null;
  login: (newUser: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
