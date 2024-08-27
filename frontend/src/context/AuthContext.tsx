import React, { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../utils/Types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (user && token) {
      setUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data?.token);
        localStorage.setItem("user", data?.user);
        setUser(data.user as User);
        setIsAuthenticated(true);
        setError(null);
      } else {
        setError(data?.message);
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data?.token);
        localStorage.setItem("user", data?.user);
        setUser(data.user as User);
        setIsAuthenticated(true);
        setError(null);
      } else {
        setError(data?.message);
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
