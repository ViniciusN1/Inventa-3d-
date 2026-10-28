"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

type User = {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  address?: any;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * LOGIN
   */
  const login = (data: any) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);

    router.push("/dashboard");
  };

  /**
   * LOGOUT
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);

    router.push("/login");
  };

  /**
   * AUTO AUTH (REFRESH SESSION)
   */
  useEffect(() => {
    async function loadUserFromToken() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data?.success && data?.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }

    loadUserFromToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}