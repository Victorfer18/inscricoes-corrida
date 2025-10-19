"use client";

import { AdminGuard } from "@/components/admin-guard";

interface AdminPageLayoutProps {
  children: React.ReactNode;
}

export function AdminPageLayout({ children }: AdminPageLayoutProps) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}

