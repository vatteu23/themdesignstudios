import { ref, get, update } from "firebase/database";
import { db } from "@/firebase";
import { logAuditAction } from "./audit";

export async function linkProjectToService(
  projectId: string,
  serviceId: string | null
): Promise<void> {
  const projectRef = ref(db, `projects/${projectId}`);
  const projectSnap = await get(projectRef);
  if (!projectSnap.exists()) throw new Error("Project not found");

  const oldServiceId = projectSnap.val().project_service as string | undefined;

  const updates: Record<string, unknown> = {
    [`projects/${projectId}/project_service`]: serviceId ?? null,
  };

  if (oldServiceId) {
    const oldServiceRef = ref(db, `services/${oldServiceId}`);
    const oldServiceSnap = await get(oldServiceRef);
    if (oldServiceSnap.exists()) {
      const current: string[] = oldServiceSnap.val().service_projects ?? [];
      updates[`services/${oldServiceId}/service_projects`] = current.filter(
        (id) => id !== projectId
      );
    }
  }

  if (serviceId) {
    const serviceRef = ref(db, `services/${serviceId}`);
    const serviceSnap = await get(serviceRef);
    if (!serviceSnap.exists()) throw new Error("Service not found");
    const current: string[] = serviceSnap.val().service_projects ?? [];
    if (!current.includes(projectId)) {
      updates[`services/${serviceId}/service_projects`] = [...current, projectId];
    }
  }

  await update(ref(db), updates);
  await logAuditAction("link", "project-service", `${projectId}:${serviceId ?? "none"}`);
}

export async function linkProjectsToService(
  serviceId: string,
  projectIds: string[]
): Promise<void> {
  const serviceRef = ref(db, `services/${serviceId}`);
  const serviceSnap = await get(serviceRef);
  if (!serviceSnap.exists()) throw new Error("Service not found");

  const oldProjectIds: string[] = serviceSnap.val().service_projects ?? [];
  const updates: Record<string, unknown> = {
    [`services/${serviceId}/service_projects`]: projectIds,
  };

  for (const pid of oldProjectIds) {
    if (!projectIds.includes(pid)) {
      updates[`projects/${pid}/project_service`] = null;
    }
  }

  for (const pid of projectIds) {
    updates[`projects/${pid}/project_service`] = serviceId;
  }

  await update(ref(db), updates);
  await logAuditAction("link_bulk", "service-projects", serviceId);
}
