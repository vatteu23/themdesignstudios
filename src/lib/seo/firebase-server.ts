import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { Service, Project, SiteSettings, PageMetadata } from "@/types/cms";
import { slugify } from "@/lib/cms/utils";
import {
  DEFAULT_PAGE_METADATA,
  DEFAULT_SITE_SETTINGS,
} from "@/lib/cms/defaults";

const firebaseConfig = {
  apiKey: "AIzaSyAWvWlPb7SDSbPgSVxbLQdDudZhYaGt-cI",
  authDomain: "bythem-f0fdb.firebaseapp.com",
  databaseURL: "https://bythem-f0fdb.firebaseio.com",
  projectId: "bythem-f0fdb",
  storageBucket: "bythem-f0fdb.appspot.com",
  messagingSenderId: "1016948882454",
  appId: "1:1016948882454:web:be72974fb1ed51ed",
};

function getApp(): FirebaseApp {
  return getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);
}

export async function getRecordServer<T>(path: string): Promise<T | null> {
  const snapshot = await get(ref(getDatabase(getApp()), path));
  return snapshot.exists() ? (snapshot.val() as T) : null;
}

export async function getSiteSettingsServer(): Promise<SiteSettings> {
  const settings = await getRecordServer<SiteSettings>("sitesettings/global");
  return settings
    ? { ...DEFAULT_SITE_SETTINGS, ...settings }
    : DEFAULT_SITE_SETTINGS;
}

export async function getPageMetadataServer(
  pageKey: string
): Promise<PageMetadata> {
  const record = await getRecordServer<PageMetadata>(`metadata/${pageKey}`);
  const defaults = DEFAULT_PAGE_METADATA[pageKey];
  return record
    ? { ...defaults, ...record }
    : defaults ?? { title: "Them design studios", description: "" };
}

async function fetchCollection<T extends object>(
  path: string
): Promise<Array<T & { id: string }>> {
  const snapshot = await get(ref(getDatabase(getApp()), path));
  if (!snapshot.exists()) return [];
  const data = snapshot.val() as Record<string, T>;
  return Object.keys(data).map((id) => ({ id, ...data[id] }));
}

export async function fetchServicesServer(): Promise<Service[]> {
  const items = await fetchCollection<Service>("services");
  return items.filter((s) => s.service_active !== false);
}

export async function fetchProjectsServer(): Promise<Project[]> {
  const items = await fetchCollection<Project>("projects");
  return items.filter((p) => p.project_active !== false);
}

export function getServiceSlug(service: Service): string {
  return (
    service.service_pagename ||
    slugify(service.service_name || "service")
  );
}

export function getProjectSlug(project: Project): string {
  return (
    project.project_pagename ||
    slugify(project.project_name || "project")
  );
}

export async function getServiceBySlug(
  slug: string
): Promise<Service | null> {
  const services = await fetchServicesServer();
  return (
    services.find(
      (s) =>
        getServiceSlug(s) === slug ||
        slugify(s.service_name || "") === slug
    ) ?? null
  );
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  const projects = await fetchProjectsServer();
  return (
    projects.find(
      (p) =>
        getProjectSlug(p) === slug ||
        slugify(p.project_name || "") === slug
    ) ?? null
  );
}
