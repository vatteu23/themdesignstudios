import { PageMetadata } from "@/types/cms";
import { getRecord, updateRecord } from "./utils";
import { logAuditAction } from "./audit";
import { DEFAULT_PAGE_METADATA } from "./defaults";

const PATH = "metadata";

export { DEFAULT_PAGE_METADATA };

export async function getPageMetadata(pageKey: string): Promise<PageMetadata> {
  const record = await getRecord<PageMetadata>(`${PATH}/${pageKey}`);
  const defaults = DEFAULT_PAGE_METADATA[pageKey];
  return record
    ? { ...defaults, ...record }
    : defaults ?? { title: "Them design studios", description: "" };
}

export async function updatePageMetadata(
  pageKey: string,
  data: Partial<PageMetadata>
): Promise<void> {
  await updateRecord(`${PATH}/${pageKey}`, data);
  await logAuditAction("update", "metadata", pageKey);
}
