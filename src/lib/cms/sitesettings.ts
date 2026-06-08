import { SiteSettings } from "@/types/cms";
import { getRecord, updateRecord } from "./utils";
import { logAuditAction } from "./audit";
import { DEFAULT_SITE_SETTINGS } from "./defaults";

const PATH = "sitesettings/global";

export { DEFAULT_SITE_SETTINGS };

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await getRecord<SiteSettings>(PATH);
  return settings ? { ...DEFAULT_SITE_SETTINGS, ...settings } : DEFAULT_SITE_SETTINGS;
}

export async function updateSiteSettings(
  data: Partial<SiteSettings>
): Promise<void> {
  await updateRecord(PATH, data);
  await logAuditAction("update", "sitesettings", "global");
}
