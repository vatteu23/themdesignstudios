"use client";

import { useEffect, useState } from "react";
import { ref, onValue, type DataSnapshot } from "firebase/database";
import { db } from "@/firebase";
import {
  Service,
  Project,
  PageContent,
  SiteSettings,
  HomeContent,
  TeamMember,
  NavItem,
} from "@/types/cms";
import { PAGE_CONTENT_KEYS, LEGACY_PAGE_CONTENT_IDS } from "@/types/cms";
import { DEFAULT_HOME_CONTENT } from "@/lib/cms/home";
import { DEFAULT_SITE_SETTINGS } from "@/lib/cms/sitesettings";
import { getDefaultNavItems } from "@/lib/cms/navigation";

function mapCollection<T>(snapshot: DataSnapshot): Array<T & { id: string }> {
  if (!snapshot.exists()) return [];
  const data = snapshot.val() as Record<string, T>;
  return Object.keys(data).map((id) => ({ id, ...data[id] }));
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(ref(db, "sitesettings/global"), (snap) => {
      const val = snap.val();
      setSettings(val ? { ...DEFAULT_SITE_SETTINGS, ...val } : DEFAULT_SITE_SETTINGS);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { settings, loading };
}

export function useNavigation() {
  const [items, setItems] = useState<NavItem[]>(getDefaultNavItems());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(ref(db, "navigation"), (snap) => {
      const data = snap.val() as Record<string, NavItem> | null;
      const parsed =
        snap.exists() && data && typeof data === "object"
          ? Object.keys(data)
              .map((key) => ({ ...data[key], id: key }))
              .filter(
                (item) => item.label && item.href && item.active !== false
              )
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          : [];

      setItems(parsed.length > 0 ? parsed : getDefaultNavItems());
      setLoading(false);
    });
    return unsub;
  }, []);

  return { items, loading };
}

export function useHomeContent() {
  const [content, setContent] = useState<HomeContent>(DEFAULT_HOME_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(ref(db, "home"), (snap) => {
      const val = snap.val();
      setContent(val ? { ...DEFAULT_HOME_CONTENT, ...val } : DEFAULT_HOME_CONTENT);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { content, loading };
}

export function usePageContent(key: string) {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(ref(db, "pagecontent"), (snap) => {
      if (!snap.exists()) {
        setContent(null);
        setLoading(false);
        return;
      }
      const all = snap.val() as Record<string, PageContent>;
      const entries = Object.entries(all);

      const byKey = entries.find(([, v]) => v.content_key === key);
      if (byKey) {
        setContent({ ...byKey[1], content_id: byKey[0] });
        setLoading(false);
        return;
      }

      const legacyId = LEGACY_PAGE_CONTENT_IDS[key];
      if (legacyId && all[legacyId]) {
        setContent({ ...all[legacyId], content_id: legacyId, content_key: key });
      } else {
        setContent(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [key]);

  return { content, loading };
}

export function useServices(activeOnly = true) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(ref(db, "services"), (snap) => {
      const items = mapCollection<Service>(snap);
      const filtered = activeOnly
        ? items.filter((s) => s.service_active !== false)
        : items;
      setServices(filtered.sort((a, b) => (a.service_order ?? 0) - (b.service_order ?? 0)));
      setLoading(false);
    });
    return unsub;
  }, [activeOnly]);

  return { services, loading };
}

export function useProjects(activeOnly = true) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(ref(db, "projects"), (snap) => {
      const items = mapCollection<Project>(snap);
      const filtered = activeOnly
        ? items.filter((p) => p.project_active !== false)
        : items;
      setProjects(
        filtered.sort((a, b) => (b.project_created_at ?? 0) - (a.project_created_at ?? 0))
      );
      setLoading(false);
    });
    return unsub;
  }, [activeOnly]);

  return { projects, loading };
}

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(ref(db, "team"), (snap) => {
      if (!snap.exists()) {
        setMembers([]);
        setLoading(false);
        return;
      }
      const data = snap.val() as Record<string, TeamMember>;
      setMembers(
        Object.keys(data)
          .map((key) => ({ ...data[key], id: key }))
          .filter((m) => m.active !== false)
          .sort((a, b) => a.order - b.order)
      );
      setLoading(false);
    });
    return unsub;
  }, []);

  return { members, loading };
}

export { PAGE_CONTENT_KEYS };
