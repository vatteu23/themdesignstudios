import { NavItem } from "@/types/cms";
import {
  createRecord,
  deleteRecord,
  getCollection,
  stripUndefined,
  updateRecord,
} from "./utils";
import { logAuditAction } from "./audit";

const PATH = "navigation";

export const DEFAULT_NAV_ITEMS: Omit<NavItem, "id">[] = [
  { label: "Home", href: "/", order: 0, active: true },
  { label: "About", href: "/about", order: 1, active: true },
  { label: "Services", href: "/services", order: 2, active: true },
  { label: "Portfolio", href: "/portfolio", order: 3, active: true },
  { label: "Contact", href: "/contact", order: 4, active: true },
];

export function getDefaultNavItems(): NavItem[] {
  return DEFAULT_NAV_ITEMS.map((item, i) => ({ id: String(i), ...item }));
}

export async function listNavItems(): Promise<NavItem[]> {
  const items = await getCollection<NavItem>(PATH);
  const active = items
    .filter((item) => item.label && item.href && item.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return active.length > 0 ? active : getDefaultNavItems();
}

export async function listAllNavItems(): Promise<NavItem[]> {
  const items = await getCollection<NavItem>(PATH);
  return items.sort((a, b) => a.order - b.order);
}

export async function createNavItem(
  data: Omit<NavItem, "id">
): Promise<string> {
  const id = await createRecord(PATH, stripUndefined(data as Record<string, unknown>));
  await logAuditAction("create", "navigation", id);
  return id;
}

export async function updateNavItem(
  id: string,
  data: Partial<Omit<NavItem, "id">>
): Promise<void> {
  await updateRecord(`${PATH}/${id}`, stripUndefined(data as Record<string, unknown>));
  await logAuditAction("update", "navigation", id);
}

export async function deleteNavItem(id: string): Promise<void> {
  await deleteRecord(`${PATH}/${id}`);
  await logAuditAction("delete", "navigation", id);
}
