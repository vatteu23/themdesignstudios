/**
 * Set Firebase custom admin claim on a user.
 *
 * Prerequisites:
 *   1. Download service account JSON from Firebase Console
 *   2. Set GOOGLE_APPLICATION_CREDENTIALS env var to its path
 *   3. Run: npx tsx scripts/set-admin-claim.ts <user-email>
 *
 * After running, the user must sign out and sign back in for the claim to take effect.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const email = process.argv[2];

if (!email) {
  console.error("Usage: npx tsx scripts/set-admin-claim.ts <user-email>");
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS!),
  });
}

async function main() {
  const user = await getAuth().getUserByEmail(email);
  await getAuth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`Admin claim set for ${email} (uid: ${user.uid})`);
  console.log("User must sign out and sign back in for the claim to apply.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
