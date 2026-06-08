"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { FormField, FormSection, SaveButton, TextAreaField } from "@/components/admin/FormField";
import ImagePicker from "@/components/admin/ImagePicker";
import { getSiteSettings, updateSiteSettings } from "@/lib/cms/sitesettings";
import { listAllNavItems, createNavItem, updateNavItem, deleteNavItem } from "@/lib/cms/navigation";
import { updatePageMetadata } from "@/lib/cms/metadata";
import { SiteSettings, NavItem, PageMetadata } from "@/types/cms";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const PAGE_KEYS = ["home", "about", "services", "portfolio", "contact"] as const;

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [metadata, setMetadata] = useState<Record<string, PageMetadata>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteNavId, setDeleteNavId] = useState<string | null>(null);
  const [newNav, setNewNav] = useState({ label: "", href: "" });

  useEffect(() => {
    async function load() {
      const [s, nav] = await Promise.all([getSiteSettings(), listAllNavItems()]);
      setSettings(s);
      setNavItems(nav);
      const meta: Record<string, PageMetadata> = {};
      for (const key of PAGE_KEYS) {
        const { getPageMetadata } = await import("@/lib/cms/metadata");
        meta[key] = await getPageMetadata(key);
      }
      setMetadata(meta);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      for (const key of PAGE_KEYS) {
        if (metadata[key]) {
          await updatePageMetadata(key, metadata[key]);
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNav = async () => {
    if (!newNav.label || !newNav.href) return;
    await createNavItem({
      label: newNav.label,
      href: newNav.href,
      order: navItems.length,
      active: true,
    });
    setNewNav({ label: "", href: "" });
    setNavItems(await listAllNavItems());
  };

  const handleDeleteNav = async () => {
    if (!deleteNavId) return;
    await deleteNavItem(deleteNavId);
    setDeleteNavId(null);
    setNavItems(await listAllNavItems());
  };

  if (loading || !settings) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
      </div>
    );
  }

  return (
    <>
      <AdminTopBar title="Site Settings" />
      <div className="p-8">
        <form onSubmit={handleSave} className="max-w-3xl space-y-6">
          {saved && (
            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Saved successfully.
            </div>
          )}

          <FormSection title="Brand">
            <FormField
              label="Site name"
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            />
            <FormField
              label="Tagline"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            />
            <FormField
              label="Site URL"
              value={settings.site_url ?? ""}
              onChange={(e) => setSettings({ ...settings, site_url: e.target.value })}
              placeholder="https://themdesignstudios.com"
            />
            <ImagePicker
              label="Default OG image"
              value={settings.og_image_url}
              onChange={(v) => setSettings({ ...settings, og_image_url: v })}
            />
            <FormField
              label="Footer copyright"
              value={settings.footer_copyright}
              onChange={(e) =>
                setSettings({ ...settings, footer_copyright: e.target.value })
              }
            />
          </FormSection>

          <FormSection title="Contact information">
            <FormField
              label="Email"
              type="email"
              value={settings.contact_email}
              onChange={(e) =>
                setSettings({ ...settings, contact_email: e.target.value })
              }
            />
            <FormField
              label="Phone"
              value={settings.contact_phone}
              onChange={(e) =>
                setSettings({ ...settings, contact_phone: e.target.value })
              }
            />
            <TextAreaField
              label="Address"
              value={settings.contact_address}
              onChange={(e) =>
                setSettings({ ...settings, contact_address: e.target.value })
              }
              rows={2}
            />
            <TextAreaField
              label="Google Maps embed URL"
              value={settings.map_embed_url}
              onChange={(e) =>
                setSettings({ ...settings, map_embed_url: e.target.value })
              }
              rows={2}
            />
          </FormSection>

          <FormSection title="Social links">
            <FormField
              label="Instagram URL"
              value={settings.social_instagram}
              onChange={(e) =>
                setSettings({ ...settings, social_instagram: e.target.value })
              }
            />
            <FormField
              label="LinkedIn URL"
              value={settings.social_linkedin}
              onChange={(e) =>
                setSettings({ ...settings, social_linkedin: e.target.value })
              }
            />
          </FormSection>

          <FormSection title="Navigation">
            {navItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <FormField
                  label="Label"
                  value={item.label}
                  onChange={(e) => {
                    const updated = navItems.map((n) =>
                      n.id === item.id ? { ...n, label: e.target.value } : n
                    );
                    setNavItems(updated);
                  }}
                  className="flex-1"
                />
                <FormField
                  label="Href"
                  value={item.href}
                  onChange={(e) => {
                    const updated = navItems.map((n) =>
                      n.id === item.id ? { ...n, href: e.target.value } : n
                    );
                    setNavItems(updated);
                  }}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await updateNavItem(item.id, { label: item.label, href: item.href });
                  }}
                  className="mt-6 text-xs text-stone-500 underline"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteNavId(item.id)}
                  className="mt-6 text-xs text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
            <div className="flex items-end gap-3 border-t border-stone-100 pt-4">
              <FormField
                label="New label"
                value={newNav.label}
                onChange={(e) => setNewNav({ ...newNav, label: e.target.value })}
              />
              <FormField
                label="New href"
                value={newNav.href}
                onChange={(e) => setNewNav({ ...newNav, href: e.target.value })}
              />
              <button
                type="button"
                onClick={handleAddNav}
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
              >
                Add link
              </button>
            </div>
          </FormSection>

          <FormSection title="Page SEO">
            {PAGE_KEYS.map((key) => (
              <div key={key} className="space-y-2 border-b border-stone-100 pb-4 last:border-0">
                <h3 className="text-sm font-medium capitalize text-stone-700">{key}</h3>
                <FormField
                  label="Title"
                  value={metadata[key]?.title ?? ""}
                  onChange={(e) =>
                    setMetadata({
                      ...metadata,
                      [key]: { ...metadata[key], title: e.target.value },
                    })
                  }
                />
                <TextAreaField
                  label="Description"
                  value={metadata[key]?.description ?? ""}
                  onChange={(e) =>
                    setMetadata({
                      ...metadata,
                      [key]: { ...metadata[key], description: e.target.value },
                    })
                  }
                  rows={2}
                />
              </div>
            ))}
          </FormSection>

          <SaveButton loading={saving} />
        </form>
      </div>

      <ConfirmDialog
        open={!!deleteNavId}
        title="Delete nav item"
        message="Remove this navigation link?"
        onConfirm={handleDeleteNav}
        onCancel={() => setDeleteNavId(null)}
      />
    </>
  );
}
