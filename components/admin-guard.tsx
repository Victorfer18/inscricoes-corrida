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
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/admin/login");
        return;
      }

      // Verificar permissões específicas se necessário
      if (requiredPermissions.length > 0 && permissions) {
        const hasPermission = requiredPermissions.every(
          (permission) => permissions[permission as keyof typeof permissions]
        );

        if (!hasPermission) {
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
