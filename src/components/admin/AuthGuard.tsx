"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "./AdminAuthProvider";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/them-admin/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="text-sm text-stone-500">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
