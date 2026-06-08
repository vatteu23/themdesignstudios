"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { fbAuth } from "@/firebase";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAdminAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/them-admin");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(fbAuth, email, password);
      router.replace("/them-admin");
    } catch {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  if (authLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-wide text-stone-800">
            Them CMS
          </h1>
          <p className="mt-1 text-sm text-stone-500">Sign in to manage content</p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-stone-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
