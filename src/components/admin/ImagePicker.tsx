"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/cms/media";
import SafeImage, { isValidImageSrc } from "./SafeImage";

interface ImagePickerProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImagePicker({ value, onChange, label }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-stone-700">{label}</label>
      )}

      {value && (
        <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-lg border border-stone-200">
          <SafeImage src={value} alt="Selected" fill />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50">
          {uploading ? "Uploading..." : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>

      <input
        type="url"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
