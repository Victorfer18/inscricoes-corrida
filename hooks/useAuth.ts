"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { AdminUser, AdminSession, LoginCredentials, AdminPermissions, ROLE_PERMISSIONS } from "@/types/admin";

interface AuthContextType {
  user: AdminUser | null;
  permissions: AdminPermissions | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export function useAuthProvider() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const permissions = user ? ROLE_PERMISSIONS[user.role] : null;
  const isAuthenticated = !!user;

  // Debug logs
  useEffect(() => {
    console.log("useAuth - Estado atual:", {
      isLoading,
      isAuthenticated,
      user: user?.email,
      hasSession: !!localStorage.getItem("admin_session")
    });
  }, [isLoading, isAuthenticated, user]);

  // Verificar se há sessão salva
  useEffect(() => {
    const checkStoredSession = async () => {
      try {
        // Tentar obter token do localStorage
        const storedSession = localStorage.getItem("admin_session");
        if (storedSession) {
          const session: AdminSession = JSON.parse(storedSession);
          
          // Verificar se a sessão não expirou
          if (new Date(session.expires_at) > new Date()) {
            // Validar sessão no servidor
            const response = await fetch("/api/admin/validate-session", {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            });

            if (response.ok) {
              const userData = await response.json();
              setUser(userData.user);
            } else {
              localStorage.removeItem("admin_session");
            }
          } else {
            localStorage.removeItem("admin_session");
          }
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        localStorage.removeItem("admin_session");
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredSession();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log("Tentando fazer login...");
      
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const session: AdminSession = await response.json();
        console.log("Login bem-sucedido:", session.user.email);
        
        // Salvar sessão no localStorage
        localStorage.setItem("admin_session", JSON.stringify(session));
        setUser(session.user);
        
        return true;
      } else {
        const error = await response.json().catch(() => ({ message: "Erro desconhecido" }));
        console.error("Erro no login:", error.message);
        return false;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_session");
    setUser(null);
  };

  return {
    user,
    permissions,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
}

export { AuthContext };
