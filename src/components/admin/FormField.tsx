"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function FormField({ label, error, hint, className = "", ...props }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-stone-700">{label}</label>
      <input
        className={`w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 ${error ? "border-red-400" : ""} ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-stone-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextAreaField({
  label,
  error,
  hint,
  className = "",
  ...props
}: TextAreaFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-stone-700">{label}</label>
      <textarea
        className={`w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 ${error ? "border-red-400" : ""} ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-stone-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="mb-4 text-base font-semibold text-stone-800">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function SaveButton({
  loading,
  label = "Save changes",
}: {
  loading?: boolean;
  label?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="rounded-lg bg-stone-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
    >
      {loading ? "Saving..." : label}
    </button>
  );
}
