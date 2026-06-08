"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { fbAuth } from "@/firebase";

interface AdminAuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fbAuth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    await signOut(fbAuth);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
