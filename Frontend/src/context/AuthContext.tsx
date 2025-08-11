import React, { createContext, useState, useEffect, ReactNode } from "react";
import API from "../api/axios";

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  country?: string;
  isVerified?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  password: string;
  confirmPassword: string;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  hydrate: async () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const res = await API.get("/auth/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      await hydrate();
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.accessToken);
    await hydrate();
  };

  const register = async (data: RegisterData) => {
    await API.post("/auth/register", data);
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, hydrate }}>
      {children}
    </AuthContext.Provider>
  );
};
