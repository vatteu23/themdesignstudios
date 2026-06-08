"use client";

import { slugify } from "@/lib/cms/utils";
import { FormField } from "./FormField";

interface SlugInputProps {
  value: string;
  onChange: (slug: string) => void;
  sourceText: string;
  label?: string;
}

export default function SlugInput({
  value,
  onChange,
  sourceText,
  label = "URL slug",
}: SlugInputProps) {
  return (
    <div className="space-y-2">
      <FormField
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        hint="Used in the public URL path"
      />
      <button
        type="button"
        onClick={() => onChange(slugify(sourceText))}
        className="text-xs text-stone-500 underline hover:text-stone-800"
      >
        Generate from title
      </button>
    </div>
  );
}
