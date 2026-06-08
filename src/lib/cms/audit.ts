import { fbAuth } from "@/firebase";
import { createRecord } from "./utils";
import { waitForAuthReady } from "./auth";

export async function logAuditAction(
  action: string,
  entity: string,
  entityId: string
): Promise<void> {
  let user = fbAuth.currentUser;
  if (!user) {
    try {
      user = await waitForAuthReady();
    } catch {
      return;
    }
  }

  await createRecord("auditlog", {
    user_id: user.uid,
    user_email: user.email ?? "",
    action,
    entity,
    entity_id: entityId,
    timestamp: Date.now(),
  });
}
