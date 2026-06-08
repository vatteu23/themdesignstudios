"use client";

import { useRef, useState } from "react";
import { uploadImages } from "@/lib/cms/media";
import SafeImage, { isValidImageSrc } from "./SafeImage";
import { FormSection } from "./FormField";
import { HiOutlineCloudArrowUp, HiOutlineTrash } from "./adminIcons";

export interface StagedImage {
  id: string;
  url: string;
  name: string;
}

interface BulkImageUploadProps {
  images: StagedImage[];
  onChange: (images: StagedImage[]) => void;
  title?: string;
  hint?: string;
}

export default function BulkImageUpload({
  images,
  onChange,
  title = "Gallery images",
  hint = "Select multiple images to upload. The first image will be used as the cover if none is set.",
}: BulkImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const files = Array.from(fileList);
    setUploading(true);
    setError(null);
    setProgress(`Uploading 0 / ${files.length}...`);

    try {
      const uploaded: StagedImage[] = [];

      for (let i = 0; i < files.length; i++) {
        setProgress(`Uploading ${i + 1} / ${files.length}...`);
        const [url] = await uploadImages([files[i]]);
        uploaded.push({
          id: `${Date.now()}-${i}`,
          url,
          name: files[i].name,
        });
      }

      onChange([...images, ...uploaded]);
      setProgress("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  return (
    <FormSection title={title}>
      <p className="text-sm text-stone-500">{hint}</p>

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-50"
        >
          <HiOutlineCloudArrowUp className="h-5 w-5" />
          {uploading ? "Uploading..." : "Bulk upload images"}
        </button>
        {images.length > 0 && (
          <span className="text-sm text-stone-500">
            {images.length} image{images.length !== 1 ? "s" : ""} staged
          </span>
        )}
      </div>

      {progress && (
        <p className="text-sm text-stone-600">{progress}</p>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-lg border border-stone-200"
            >
              <div className="relative h-28">
                {isValidImageSrc(img.url) ? (
                  <SafeImage src={img.url} alt={img.name} fill />
                ) : (
                  <div className="flex h-full items-center justify-center bg-stone-100 text-xs text-stone-400">
                    Invalid URL
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                <p className="truncate text-xs text-stone-500">
                  {index === 0 ? "Cover candidate" : img.name}
                </p>
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="shrink-0 text-stone-400 hover:text-red-600"
                  aria-label="Remove image"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </FormSection>
  );
}
