"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { listEmails, markEmailRead } from "@/lib/cms/emails";
import { EmailSubmission } from "@/types/cms";

export default function EmailsPage() {
  const [emails, setEmails] = useState<EmailSubmission[]>([]);
  const [selected, setSelected] = useState<EmailSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listEmails().then((data) => {
      setEmails(data);
      setLoading(false);
    });
  }, []);

  const handleSelect = async (email: EmailSubmission) => {
    setSelected(email);
    if (!email.read) {
      await markEmailRead(email.id);
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, read: true } : e))
      );
    }
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <>
      <AdminTopBar title="Emails" />
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-80 shrink-0 overflow-y-auto border-r border-stone-200 bg-white">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
            </div>
          ) : emails.length === 0 ? (
            <p className="p-4 text-sm text-stone-500">No emails yet.</p>
          ) : (
            emails.map((email) => (
              <button
                key={email.id}
                onClick={() => handleSelect(email)}
                className={`w-full border-b border-stone-100 px-4 py-3 text-left transition-colors hover:bg-stone-50 ${
                  selected?.id === email.id ? "bg-stone-100" : ""
                } ${!email.read ? "font-medium" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm text-stone-800">
                    {email.name}
                  </span>
                  {!email.read && (
                    <span className="ml-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                </div>
                <p className="truncate text-xs text-stone-500">{email.email}</p>
                <p className="text-xs text-stone-400">
                  {formatDate(email.timestamp)}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {selected ? (
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-stone-800">
                {selected.name}
              </h2>
              <div className="mt-2 space-y-1 text-sm text-stone-500">
                <p>
                  <a href={`mailto:${selected.email}`} className="hover:underline">
                    {selected.email}
                  </a>
                </p>
                {selected.phone && <p>{selected.phone}</p>}
                <p>{formatDate(selected.timestamp)}</p>
              </div>
              <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6">
                <p className="whitespace-pre-wrap text-stone-700">
                  {selected.message}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-stone-500">Select an email to view</p>
          )}
        </div>
      </div>
    </>
  );
}
