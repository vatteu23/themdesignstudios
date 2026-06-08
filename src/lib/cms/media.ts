import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { fbStorage } from "@/firebase";
import { v4 as uuidv4 } from "uuid";
import { logAuditAction } from "./audit";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export interface MediaFile {
  name: string;
  url: string;
  path: string;
}

export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must be smaller than 10MB");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${uuidv4()}.${ext}`;
  const path = `images/${filename}`;
  const fileRef = storageRef(fbStorage, path);

  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  await logAuditAction("upload", "media", path);
  return url;
}

export async function uploadImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map((file) => uploadImage(file)));
}

export async function listMediaFiles(): Promise<MediaFile[]> {
  const imagesRef = storageRef(fbStorage, "images");
  try {
    const result = await listAll(imagesRef);
    const files = await Promise.all(
      result.items.map(async (item) => ({
        name: item.name,
        path: item.fullPath,
        url: await getDownloadURL(item),
      }))
    );
    return files.sort((a, b) => b.name.localeCompare(a.name));
  } catch {
    return [];
  }
}

export async function deleteMediaFile(path: string): Promise<void> {
  const fileRef = storageRef(fbStorage, path);
  await deleteObject(fileRef);
  await logAuditAction("delete", "media", path);
}
