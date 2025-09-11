"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AdminGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export function AdminGuard({ children, requiredPermissions = [] }: AdminGuardProps) {
  const { isAuthenticated, isLoading, user, permissions } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("AdminGuard - isLoading:", isLoading, "isAuthenticated:", isAuthenticated, "user:", user?.email);
    
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("AdminGuard - Não autenticado, redirecionando para login");
        router.push("/admin/login");
        return;
      }

      console.log("AdminGuard - Usuário autenticado:", user?.email);

      // Verificar permissões específicas se necessário
      if (requiredPermissions.length > 0 && permissions) {
        const hasPermission = requiredPermissions.every(
          (permission) => permissions[permission as keyof typeof permissions]
        );

        if (!hasPermission) {
          console.log("AdminGuard - Sem permissão, redirecionando para login");
          router.push("/admin/login");
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, permissions, requiredPermissions, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
