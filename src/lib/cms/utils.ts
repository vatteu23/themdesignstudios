import { ref, get, set, push, remove, update, onValue, Unsubscribe } from "firebase/database";
import { db } from "@/firebase";
import { ensureAuthToken, waitForAuthReady } from "./auth";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function getRecord<T>(path: string): Promise<T | null> {
  await ensureAuthToken();
  const snapshot = await get(ref(db, path));
  return snapshot.exists() ? (snapshot.val() as T) : null;
}

export async function getCollection<T extends object>(
  path: string
): Promise<Array<T & { id: string }>> {
  await ensureAuthToken();
  const snapshot = await get(ref(db, path));
  if (!snapshot.exists()) return [];
  const data = snapshot.val() as Record<string, T>;
  return Object.keys(data).map((id) => ({ id, ...data[id] }));
}

export function subscribeCollection<T extends object>(
  path: string,
  callback: (items: Array<T & { id: string }>) => void
): Unsubscribe {
  return onValue(ref(db, path), (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    const data = snapshot.val() as Record<string, T>;
    callback(
      Object.keys(data).map((id) => ({ id, ...data[id] }))
    );
  });
}

export async function createRecord(
  path: string,
  data: Record<string, unknown>
): Promise<string> {
  await waitForAuthReady();
  const newRef = push(ref(db, path));
  await set(newRef, { ...data, created_at: Date.now() });
  return newRef.key!;
}

export async function updateRecord(
  path: string,
  data: Record<string, unknown>
): Promise<void> {
  await waitForAuthReady();
  await update(ref(db, path), data);
}

export async function deleteRecord(path: string): Promise<void> {
  await waitForAuthReady();
  await remove(ref(db, path));
}

export function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}
