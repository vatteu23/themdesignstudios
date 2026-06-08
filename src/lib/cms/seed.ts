import { ref, get, set, update, push } from "firebase/database";
import { db } from "@/firebase";
import { DEFAULT_HOME_CONTENT } from "./home";
import { DEFAULT_SITE_SETTINGS } from "./sitesettings";
import { DEFAULT_NAV_ITEMS } from "./navigation";
import { LEGACY_PAGE_CONTENT_IDS } from "@/types/cms";
import { waitForAuthReady } from "./auth";

export async function seedCmsContent(): Promise<{ seeded: string[] }> {
  await waitForAuthReady();
  const seeded: string[] = [];

  const homeSnap = await get(ref(db, "home"));
  if (!homeSnap.exists()) {
    await set(ref(db, "home"), DEFAULT_HOME_CONTENT);
    seeded.push("home");
  }

  const settingsSnap = await get(ref(db, "sitesettings/global"));
  if (!settingsSnap.exists()) {
    await set(ref(db, "sitesettings/global"), DEFAULT_SITE_SETTINGS);
    seeded.push("sitesettings");
  }

  const navSnap = await get(ref(db, "navigation"));
  const navData = navSnap.val();
  const navIsEmpty =
    !navSnap.exists() ||
    !navData ||
    typeof navData !== "object" ||
    Object.keys(navData).length === 0;
  if (navIsEmpty) {
    for (const item of DEFAULT_NAV_ITEMS) {
      const newRef = push(ref(db, "navigation"));
      await set(newRef, item);
    }
    seeded.push("navigation");
  }

  const teamSnap = await get(ref(db, "team"));
  if (!teamSnap.exists()) {
    const teamRef = push(ref(db, "team"));
    await set(teamRef, {
      name: "Maneesh J",
      role: "Founder & Principal Designer",
      bio: "Founded theM Studios in 2016, working as Principal Designer. Expert in Architecture, Interior Design, and Turnkey Project management.",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/bythem-f0fdb.appspot.com/o/images%2Fdbaff600-ba03-4138-9692-1ea93e97578e.webp?alt=media&token=8d63ec35-7025-4b13-9dec-1215a55262bb",
      order: 0,
      active: true,
    });
    seeded.push("team");
  }

  for (const [key, legacyId] of Object.entries(LEGACY_PAGE_CONTENT_IDS)) {
    const contentRef = ref(db, `pagecontent/${legacyId}`);
    const snap = await get(contentRef);
    if (snap.exists()) {
      const val = snap.val();
      if (!val.content_key) {
        await update(contentRef, { content_key: key });
        seeded.push(`pagecontent:${key}`);
      }
    }
  }

  return { seeded };
}
