"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AuthGuard from "@/components/admin/AuthGuard";
import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/them-admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-stone-100">{children}</div>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-stone-50">
        <AdminSidebar />
        <div className="ml-64 min-h-screen">{children}</div>
      </div>
    </AuthGuard>
  );
}
