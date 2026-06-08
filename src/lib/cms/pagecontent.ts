import { LEGACY_PAGE_CONTENT_IDS, PageContent, PAGE_CONTENT_KEYS } from "@/types/cms";
import {
  createRecord,
  deleteRecord,
  getCollection,
  getRecord,
  stripUndefined,
  updateRecord,
} from "./utils";
import { logAuditAction } from "./audit";

const PATH = "pagecontent";

export async function listPageContents(): Promise<PageContent[]> {
  const items = await getCollection<PageContent>(PATH);
  return items.map((item) => ({ ...item, content_id: item.id }));
}

export async function getPageContentByKey(key: string): Promise<PageContent | null> {
  const all = await listPageContents();
  const byKey = all.find((c) => c.content_key === key);
  if (byKey) return byKey;

  const legacyId = LEGACY_PAGE_CONTENT_IDS[key];
  if (legacyId) {
    const record = await getRecord<PageContent>(`${PATH}/${legacyId}`);
    if (record) return { ...record, content_id: legacyId, content_key: key };
  }
  return null;
}

export async function getPageContent(id: string): Promise<PageContent | null> {
  const record = await getRecord<PageContent>(`${PATH}/${id}`);
  return record ? { ...record, content_id: id } : null;
}

export async function createPageContent(
  data: Omit<PageContent, "content_id">
): Promise<string> {
  const id = await createRecord(PATH, stripUndefined(data as Record<string, unknown>));
  await logAuditAction("create", "pagecontent", id);
  return id;
}

export async function updatePageContent(
  id: string,
  data: Partial<PageContent>
): Promise<void> {
  await updateRecord(`${PATH}/${id}`, stripUndefined(data as Record<string, unknown>));
  await logAuditAction("update", "pagecontent", id);
}

export async function deletePageContent(id: string): Promise<void> {
  await deleteRecord(`${PATH}/${id}`);
  await logAuditAction("delete", "pagecontent", id);
}

export async function ensurePageContentKeys(): Promise<void> {
  const all = await listPageContents();
  const keys = Object.values(PAGE_CONTENT_KEYS);

  for (const key of keys) {
    const exists = all.some((c) => c.content_key === key);
    if (!exists) {
      const legacyId = LEGACY_PAGE_CONTENT_IDS[key];
      if (legacyId) {
        const legacy = await getRecord<PageContent>(`${PATH}/${legacyId}`);
        if (legacy) {
          await updateRecord(`${PATH}/${legacyId}`, { content_key: key });
          continue;
        }
      }
      await createPageContent({
        content_key: key,
        content_title: key === PAGE_CONTENT_KEYS.WHAT_WE_DO ? "What we do" : "Who we are",
        content_description: "",
        content_active: "false",
      });
    }
  }
}
