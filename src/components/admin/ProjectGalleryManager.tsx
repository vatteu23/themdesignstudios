"use client";

import { useEffect, useRef, useState } from "react";
import { FormSection } from "./FormField";
import ImagePicker from "./ImagePicker";
import SafeImage, { isValidImageSrc } from "./SafeImage";
import ConfirmDialog from "./ConfirmDialog";
import { uploadImages } from "@/lib/cms/media";
import {
  listProjectImages,
  addProjectImage,
  addProjectImages,
  deleteProjectImage,
} from "@/lib/cms/projects";
import { ProjectImage } from "@/types/cms";
import { HiOutlineCloudArrowUp, HiOutlineTrash } from "./adminIcons";

interface ProjectGalleryManagerProps {
  projectId: string;
}

export default function ProjectGalleryManager({
  projectId,
}: ProjectGalleryManagerProps) {
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const data = await listProjectImages(projectId);
    setImages(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [projectId]);

  const handleAdd = async () => {
    if (!newUrl || !isValidImageSrc(newUrl)) return;
    setAdding(true);
    try {
      await addProjectImage(projectId, newUrl, newCaption);
      setNewUrl("");
      setNewCaption("");
      await load();
    } finally {
      setAdding(false);
    }
  };

  const handleBulkUpload = async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const files = Array.from(fileList);
    setBulkUploading(true);
    setBulkProgress(`Uploading 0 / ${files.length}...`);

    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        setBulkProgress(`Uploading ${i + 1} / ${files.length}...`);
        const [url] = await uploadImages([files[i]]);
        urls.push(url);
      }

      await addProjectImages(projectId, urls, images.length);
      setBulkProgress("");
      await load();
    } finally {
      setBulkUploading(false);
      if (bulkInputRef.current) bulkInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteProjectImage(deleteId);
    setDeleteId(null);
    await load();
  };

  return (
    <FormSection title="Project gallery">
      <div className="space-y-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4">
        <p className="text-sm font-medium text-stone-700">Bulk upload</p>
        <input
          ref={bulkInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleBulkUpload(e.target.files)}
          disabled={bulkUploading}
        />
        <button
          type="button"
          onClick={() => bulkInputRef.current?.click()}
          disabled={bulkUploading}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-50"
        >
          <HiOutlineCloudArrowUp className="h-5 w-5" />
          {bulkUploading ? "Uploading..." : "Select multiple images"}
        </button>
        {bulkProgress && (
          <p className="text-sm text-stone-600">{bulkProgress}</p>
        )}
      </div>

      <div className="space-y-4 border-t border-stone-100 pt-4">
        <p className="text-sm font-medium text-stone-700">Add single image</p>
        <ImagePicker value={newUrl} onChange={setNewUrl} label="Image URL or upload" />
        <input
          type="text"
          value={newCaption}
          onChange={(e) => setNewCaption(e.target.value)}
          placeholder="Caption (optional)"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newUrl || !isValidImageSrc(newUrl) || adding}
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add to gallery"}
        </button>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-stone-500">Loading gallery...</p>
      ) : images.length === 0 ? (
        <p className="mt-4 text-sm text-stone-500">No gallery images yet.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-lg border border-stone-200"
            >
              <div className="relative h-32">
                <SafeImage
                  src={img.image_projectimage}
                  alt={img.image_caption ?? "Gallery image"}
                  fill
                />
              </div>
              {img.image_caption && (
                <p className="truncate px-2 py-1 text-xs text-stone-500">
                  {img.image_caption}
                </p>
              )}
              <button
                type="button"
                onClick={() => setDeleteId(img.id)}
                className="absolute right-2 top-2 rounded bg-red-600 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <HiOutlineTrash className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Remove image"
        message="Remove this image from the project gallery?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </FormSection>
  );
}
