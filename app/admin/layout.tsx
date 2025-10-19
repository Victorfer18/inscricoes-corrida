"use client";

import { AuthProvider } from "@/components/auth-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="admin-layout">{children}</div>
    </AuthProvider>
  );
}
