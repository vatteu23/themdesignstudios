import { onAuthStateChanged, User } from "firebase/auth";
import { fbAuth } from "@/firebase";

/**
 * If a user is signed in, refresh their ID token so the next RTDB
 * request includes credentials. No-op when signed out.
 */
export async function ensureAuthToken(): Promise<void> {
  if (fbAuth.currentUser) {
    await fbAuth.currentUser.getIdToken();
    return;
  }
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(fbAuth, async (user) => {
      unsub();
      if (user) {
        await user.getIdToken();
      }
      resolve();
    });
  });
}

/**
 * Waits until Firebase Auth has a user and their ID token is ready.
 * Required before reading/writing auth-gated paths (emails, auditlog).
 */
export function waitForAuthReady(): Promise<User> {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(fbAuth, async (user) => {
      unsub();
      if (!user) {
        reject(new Error("Not authenticated"));
        return;
      }
      await user.getIdToken();
      resolve(user);
    });
  });
}
