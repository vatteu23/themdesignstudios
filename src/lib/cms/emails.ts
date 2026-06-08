import { EmailSubmission } from "@/types/cms";
import { getCollection, updateRecord } from "./utils";
import { logAuditAction } from "./audit";
import { waitForAuthReady } from "./auth";

const PATH = "emails";

export async function listEmails(): Promise<EmailSubmission[]> {
  await waitForAuthReady();
  const items = await getCollection<EmailSubmission>(PATH);
  return items.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
}

export async function markEmailRead(id: string, read = true): Promise<void> {
  await waitForAuthReady();
  await updateRecord(`${PATH}/${id}`, { read });
  await logAuditAction("update", "email", id);
}

export async function markEmailUnread(id: string): Promise<void> {
  await markEmailRead(id, false);
}
