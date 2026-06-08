import { Service } from "@/types/cms";
import {
  createRecord,
  deleteRecord,
  getCollection,
  getRecord,
  slugify,
  stripUndefined,
  subscribeCollection,
  updateRecord,
} from "./utils";
import { logAuditAction } from "./audit";
import { linkProjectsToService } from "./relationships";

const PATH = "services";

export async function listServices(): Promise<Service[]> {
  const items = await getCollection<Service>(PATH);
  return items.sort((a, b) => (a.service_order ?? 0) - (b.service_order ?? 0));
}

export function subscribeServices(
  callback: (services: Service[]) => void
): () => void {
  return subscribeCollection<Service>(PATH, (items) => {
    callback(items.sort((a, b) => (a.service_order ?? 0) - (b.service_order ?? 0)));
  });
}

export async function getService(id: string): Promise<Service | null> {
  const record = await getRecord<Omit<Service, "id">>(`${PATH}/${id}`);
  return record ? { id, ...record } : null;
}

export async function createService(
  data: Omit<Service, "id">,
  linkedProjectIds?: string[]
): Promise<string> {
  const id = await createRecord(PATH, {
    ...stripUndefined(data as Record<string, unknown>),
    service_created_at: Date.now(),
    service_pagename: data.service_pagename || slugify(data.service_name),
    service_active: data.service_active ?? true,
    service_projects: linkedProjectIds ?? [],
  });

  if (linkedProjectIds?.length) {
    await linkProjectsToService(id, linkedProjectIds);
  }

  await logAuditAction("create", "service", id);
  return id;
}

export async function updateService(
  id: string,
  data: Partial<Omit<Service, "id">>,
  linkedProjectIds?: string[]
): Promise<void> {
  await updateRecord(`${PATH}/${id}`, stripUndefined(data as Record<string, unknown>));

  if (linkedProjectIds !== undefined) {
    await linkProjectsToService(id, linkedProjectIds);
  }

  await logAuditAction("update", "service", id);
}

export async function deleteService(id: string): Promise<void> {
  const service = await getService(id);
  if (service?.service_projects?.length) {
    await linkProjectsToService(id, []);
  }
  await deleteRecord(`${PATH}/${id}`);
  await logAuditAction("delete", "service", id);
}
