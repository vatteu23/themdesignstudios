/**
 * One-time seed script for CMS default content.
 * Run with: npx tsx scripts/seed-cms-content.ts
 *
 * Requires Firebase client credentials (uses same config as the app).
 * Must be run by an authenticated admin user — open browser console on
 * /them-admin and run seed from the dashboard "Seed default content" button instead,
 * or use this script in a Node environment with appropriate auth.
 */

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, update, push } from "firebase/database";

const config = {
  apiKey: "AIzaSyAWvWlPb7SDSbPgSVxbLQdDudZhYaGt-cI",
  authDomain: "bythem-f0fdb.firebaseapp.com",
  databaseURL: "https://bythem-f0fdb.firebaseio.com",
  projectId: "bythem-f0fdb",
  storageBucket: "bythem-f0fdb.appspot.com",
  messagingSenderId: "1016948882454",
  appId: "1:1016948882454:web:be72974fb1ed51ed",
};

const app = initializeApp(config);
const db = getDatabase(app);

const LEGACY_PAGE_CONTENT_IDS: Record<string, string> = {
  "what-we-do": "-MDGRuhFTBixRVFspb4V",
  "who-we-are": "-MDIt4KlYbfKpBOh36ua",
};

async function seed() {
  console.log("Seeding CMS content...");

  const homeSnap = await get(ref(db, "home"));
  if (!homeSnap.exists()) {
    await set(ref(db, "home"), {
      hero_quote: "Simple is hard",
      hero_author: "Martin Charles Scorsese",
      hero_gallery: [
        {
          image_url:
            "https://firebasestorage.googleapis.com/v0/b/bythem-f0fdb.appspot.com/o/images%2F14a76468-760f-4fd3-8211-4973f72db80a.jpg?alt=media&token=f8e6436f-818e-4455-b236-80c244f037f1",
          alt: "Interior space",
          order: 0,
        },
        {
          image_url:
            "https://firebasestorage.googleapis.com/v0/b/bythem-f0fdb.appspot.com/o/images%2Ff294141a-6963-4de7-94e8-f2cd21ed267c.jpg?alt=media&token=2d6b306d-c106-4e1d-b363-5965c9faf640",
          alt: "Interior design",
          order: 1,
        },
        {
          image_url:
            "https://firebasestorage.googleapis.com/v0/b/bythem-f0fdb.appspot.com/o/images%2F2a98a1a0-1799-404b-b474-23c3f73e7024.jpg?alt=media&token=b5b2ccb8-4ded-4e59-a317-2cf0d5daebf8",
          alt: "Architecture",
          order: 2,
        },
      ],
      philosophy_title: "Our Design Philosophy",
      philosophy_body:
        "At theM, we believe that great design emerges from understanding the unique needs of each client and space.",
      services_display: "featured",
      featured_service_ids: [],
    });
    console.log("  ✓ home");
  }

  const settingsSnap = await get(ref(db, "sitesettings/global"));
  if (!settingsSnap.exists()) {
    await set(ref(db, "sitesettings/global"), {
      site_name: "Them design studios",
      tagline: "Architecture & Spatial Design Services",
      og_image_url: "/them-studios.png",
      contact_email: "maneesh@themdesignstudios.com",
      contact_phone: "+917702277247",
      contact_address: "LB Nagar, Hyderabad, India",
      map_embed_url:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.5!2d78.5!3d17.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDE4JzAwLjAiTiA3OMKwMzAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890",
      social_instagram: "https://www.instagram.com/themhyd/",
      social_linkedin: "https://www.linkedin.com/company/them-studios/",
      footer_copyright: "Them design studios. All rights reserved.",
    });
    console.log("  ✓ sitesettings");
  }

  for (const [key, legacyId] of Object.entries(LEGACY_PAGE_CONTENT_IDS)) {
    const contentRef = ref(db, `pagecontent/${legacyId}`);
    const snap = await get(contentRef);
    if (snap.exists() && !snap.val().content_key) {
      await update(contentRef, { content_key: key });
      console.log(`  ✓ pagecontent key: ${key}`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
