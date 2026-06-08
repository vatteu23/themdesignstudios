"use client";

import { useEffect, useState } from "react";
import SafeImage from "@/components/admin/SafeImage";
import { HiOutlineCloudArrowUp } from "@/components/admin/adminIcons";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { listMediaFiles, uploadImage, deleteMediaFile, MediaFile } from "@/lib/cms/media";

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletePath, setDeletePath] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await listMediaFiles();
    setFiles(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadImage(file);
      await load();
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePath) return;
    await deleteMediaFile(deletePath);
    setDeletePath(null);
    await load();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <AdminTopBar title="Media Library" />
      <div className="p-8">
        <div className="mb-6">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
            <HiOutlineCloudArrowUp className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
          <p className="mt-2 text-xs text-stone-500">
            Images are stored in Firebase Storage. Click any image to copy its URL.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
          </div>
        ) : files.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 py-12 text-center text-stone-500">
            No images uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {files.map((file) => (
              <div
                key={file.path}
                className="group relative overflow-hidden rounded-lg border border-stone-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => copyUrl(file.url)}
                  className="block w-full"
                >
                  <div className="relative h-32">
                    <SafeImage src={file.url} alt={file.name} fill />
                  </div>
                  <p className="truncate px-2 py-1 text-xs text-stone-500">
                    {copied === file.url ? "Copied!" : file.name}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setDeletePath(file.path)}
                  className="absolute right-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deletePath}
        title="Delete image"
        message="Permanently delete this image from Firebase Storage?"
        onConfirm={handleDelete}
        onCancel={() => setDeletePath(null)}
      />
    </>
  );
}
