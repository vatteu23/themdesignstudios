"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { FormField, FormSection, SaveButton, TextAreaField } from "@/components/admin/FormField";
import ImagePicker from "@/components/admin/ImagePicker";
import { getHomeContent, updateHomeContent } from "@/lib/cms/home";
import { listServices } from "@/lib/cms/services";
import { HomeContent, HeroGalleryItem, Service } from "@/types/cms";

export default function HomePageEditor() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([getHomeContent(), listServices()]).then(([home, svcs]) => {
      setContent(home);
      setServices(svcs);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setSaving(true);
    try {
      await updateHomeContent(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const updateGallery = (index: number, field: keyof HeroGalleryItem, value: string | number) => {
    if (!content) return;
    const gallery = [...content.hero_gallery];
    gallery[index] = { ...gallery[index], [field]: value };
    setContent({ ...content, hero_gallery: gallery });
  };

  const addGalleryItem = () => {
    if (!content) return;
    setContent({
      ...content,
      hero_gallery: [
        ...content.hero_gallery,
        { image_url: "", alt: "", order: content.hero_gallery.length },
      ],
    });
  };

  const removeGalleryItem = (index: number) => {
    if (!content) return;
    setContent({
      ...content,
      hero_gallery: content.hero_gallery.filter((_, i) => i !== index),
    });
  };

  const toggleFeaturedService = (id: string) => {
    if (!content) return;
    const ids = content.featured_service_ids ?? [];
    setContent({
      ...content,
      featured_service_ids: ids.includes(id)
        ? ids.filter((i) => i !== id)
        : [...ids, id],
    });
  };

  if (loading || !content) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
      </div>
    );
  }

  return (
    <>
      <AdminTopBar title="Home Page" />
      <div className="p-8">
        <form onSubmit={handleSave} className="max-w-3xl space-y-6">
          {saved && (
            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Saved successfully.
            </div>
          )}

          <FormSection title="Hero section">
            <FormField
              label="Quote"
              value={content.hero_quote}
              onChange={(e) => setContent({ ...content, hero_quote: e.target.value })}
            />
            <FormField
              label="Author"
              value={content.hero_author}
              onChange={(e) => setContent({ ...content, hero_author: e.target.value })}
            />
          </FormSection>

          <FormSection title="Hero gallery">
            {content.hero_gallery.map((item, index) => (
              <div key={index} className="rounded-lg border border-stone-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-600">
                    Image {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(index)}
                    className="text-xs text-red-500"
                  >
                    Remove
                  </button>
                </div>
                <ImagePicker
                  value={item.image_url}
                  onChange={(v) => updateGallery(index, "image_url", v)}
                />
                <FormField
                  label="Alt text"
                  value={item.alt}
                  onChange={(e) => updateGallery(index, "alt", e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addGalleryItem}
              className="text-sm text-stone-600 underline"
            >
              Add gallery image
            </button>
          </FormSection>

          <FormSection title="Design philosophy">
            <FormField
              label="Title"
              value={content.philosophy_title}
              onChange={(e) =>
                setContent({ ...content, philosophy_title: e.target.value })
              }
            />
            <TextAreaField
              label="Body"
              value={content.philosophy_body}
              onChange={(e) =>
                setContent({ ...content, philosophy_body: e.target.value })
              }
              rows={4}
            />
          </FormSection>

          <FormSection title="Featured services (home grid)">
            <div className="space-y-2">
              {services.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center gap-2 text-sm text-stone-700"
                >
                  <input
                    type="checkbox"
                    checked={content.featured_service_ids?.includes(s.id)}
                    onChange={() => toggleFeaturedService(s.id)}
                    className="rounded border-stone-300"
                  />
                  {s.service_name}
                </label>
              ))}
            </div>
            <p className="text-xs text-stone-500">
              Selected services appear on the home page. If none selected, all active
              services are shown.
            </p>
          </FormSection>

          <SaveButton loading={saving} />
        </form>
      </div>
    </>
  );
}
