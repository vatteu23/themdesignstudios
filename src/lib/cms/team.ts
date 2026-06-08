import { TeamMember } from "@/types/cms";
import {
  createRecord,
  deleteRecord,
  getCollection,
  getRecord,
  stripUndefined,
  updateRecord,
} from "./utils";
import { logAuditAction } from "./audit";

const PATH = "team";

export async function listTeamMembers(): Promise<TeamMember[]> {
  const items = await getCollection<TeamMember>(PATH);
  return items
    .filter((m) => m.active !== false)
    .sort((a, b) => a.order - b.order);
}

export async function listAllTeamMembers(): Promise<TeamMember[]> {
  const items = await getCollection<TeamMember>(PATH);
  return items.sort((a, b) => a.order - b.order);
}

export async function getTeamMember(id: string): Promise<TeamMember | null> {
  const record = await getRecord<Omit<TeamMember, "id">>(`${PATH}/${id}`);
  return record ? { id, ...record } : null;
}

export async function createTeamMember(
  data: Omit<TeamMember, "id">
): Promise<string> {
  const id = await createRecord(PATH, stripUndefined(data as Record<string, unknown>));
  await logAuditAction("create", "team", id);
  return id;
}

export async function updateTeamMember(
  id: string,
  data: Partial<Omit<TeamMember, "id">>
): Promise<void> {
  await updateRecord(`${PATH}/${id}`, stripUndefined(data as Record<string, unknown>));
  await logAuditAction("update", "team", id);
}

export async function deleteTeamMember(id: string): Promise<void> {
  await deleteRecord(`${PATH}/${id}`);
  await logAuditAction("delete", "team", id);
}
