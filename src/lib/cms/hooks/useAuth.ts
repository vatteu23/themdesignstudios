"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

/** @deprecated Use useAdminAuth from AdminAuthProvider inside admin routes */
export function useAuth() {
  return useAdminAuth();
}

export function useRequireAuth() {
  return useAdminAuth();
}
