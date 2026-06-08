"use client";

import { useAuth } from "@/lib/cms/hooks/useAuth";

export default function AdminTopBar({ title }: { title?: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white/95 px-8 backdrop-blur">
      <h1 className="text-lg font-semibold text-stone-800">
        {title ?? "Dashboard"}
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-stone-500">{user?.email}</span>
        <button
          onClick={() => logout()}
          className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
