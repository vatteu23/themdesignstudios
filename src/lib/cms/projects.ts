import { Project, ProjectImage } from "@/types/cms";
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
import { linkProjectToService } from "./relationships";

const PROJECTS_PATH = "projects";
const IMAGES_PATH = "projectimages";

export async function listProjects(): Promise<Project[]> {
  const items = await getCollection<Project>(PROJECTS_PATH);
  return items.sort(
    (a, b) => (b.project_created_at ?? 0) - (a.project_created_at ?? 0)
  );
}

export function subscribeProjects(
  callback: (projects: Project[]) => void
): () => void {
  return subscribeCollection<Project>(PROJECTS_PATH, (items) => {
    callback(
      items.sort((a, b) => (b.project_created_at ?? 0) - (a.project_created_at ?? 0))
    );
  });
}

export async function getProject(id: string): Promise<Project | null> {
  const record = await getRecord<Omit<Project, "id">>(`${PROJECTS_PATH}/${id}`);
  return record ? { id, ...record } : null;
}

export async function createProject(
  data: Omit<Project, "id">,
  serviceId?: string | null
): Promise<string> {
  const id = await createRecord(PROJECTS_PATH, {
    ...stripUndefined(data as Record<string, unknown>),
    project_created_at: Date.now(),
    project_pagename: data.project_pagename || slugify(data.project_name),
    project_active: data.project_active ?? true,
  });

  if (serviceId) {
    await linkProjectToService(id, serviceId);
  }

  await logAuditAction("create", "project", id);
  return id;
}

export async function updateProject(
  id: string,
  data: Partial<Omit<Project, "id">>,
  serviceId?: string | null
): Promise<void> {
  await updateRecord(
    `${PROJECTS_PATH}/${id}`,
    stripUndefined(data as Record<string, unknown>)
  );

  if (serviceId !== undefined) {
    await linkProjectToService(id, serviceId);
  }

  await logAuditAction("update", "project", id);
}

export async function deleteProject(id: string): Promise<void> {
  const images = await listProjectImages(id);
  for (const img of images) {
    await deleteProjectImage(img.id);
  }
  await linkProjectToService(id, null);
  await deleteRecord(`${PROJECTS_PATH}/${id}`);
  await logAuditAction("delete", "project", id);
}

export async function listProjectImages(
  projectId: string
): Promise<ProjectImage[]> {
  const all = await getCollection<ProjectImage>(IMAGES_PATH);
  return all
    .filter((img) => img.image_projectid === projectId)
    .sort((a, b) => (a.image_order ?? 0) - (b.image_order ?? 0));
}

export async function addProjectImage(
  projectId: string,
  imageUrl: string,
  caption?: string,
  order?: number
): Promise<string> {
  const id = await createRecord(IMAGES_PATH, {
    image_projectid: projectId,
    image_projectimage: imageUrl,
    image_caption: caption ?? "",
    image_order: order ?? Date.now(),
  });
  await logAuditAction("create", "projectimage", id);
  return id;
}

export async function addProjectImages(
  projectId: string,
  imageUrls: string[],
  startOrder = 0
): Promise<void> {
  await Promise.all(
    imageUrls.map((url, index) =>
      addProjectImage(projectId, url, "", startOrder + index)
    )
  );
}

export async function updateProjectImage(
  id: string,
  data: Partial<Omit<ProjectImage, "id">>
): Promise<void> {
  await updateRecord(`${IMAGES_PATH}/${id}`, stripUndefined(data as Record<string, unknown>));
  await logAuditAction("update", "projectimage", id);
}

export async function deleteProjectImage(id: string): Promise<void> {
  await deleteRecord(`${IMAGES_PATH}/${id}`);
  await logAuditAction("delete", "projectimage", id);
}
