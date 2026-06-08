"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { FormField, FormSection, SaveButton } from "@/components/admin/FormField";
import {
  listPageContents,
  updatePageContent,
  ensurePageContentKeys,
} from "@/lib/cms/pagecontent";
import { PageContent } from "@/types/cms";

export default function ContentPage() {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [selected, setSelected] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      await ensurePageContentKeys();
      const data = await listPageContents();
      setContents(data);
      if (data.length > 0) setSelected(data[0]);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected?.content_id) return;
    setSaving(true);
    try {
      await updatePageContent(selected.content_id, {
        content_title: selected.content_title,
        content_description: selected.content_description,
        content_active: selected.content_active,
        content_key: selected.content_key,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminTopBar title="Page Content" />
      <div className="p-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="w-56 shrink-0">
              <ul className="space-y-1">
                {contents.map((c) => (
                  <li key={c.content_id}>
                    <button
                      onClick={() => setSelected(c)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                        selected?.content_id === c.content_id
                          ? "bg-stone-800 text-white"
                          : "text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {c.content_title || c.content_key || c.content_id}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {selected && (
              <form onSubmit={handleSave} className="flex-1 max-w-3xl space-y-4">
                {saved && (
                  <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    Saved successfully.
                  </div>
                )}
                <FormSection title={selected.content_title || "Content block"}>
                  <FormField
                    label="Title"
                    value={selected.content_title}
                    onChange={(e) =>
                      setSelected({ ...selected, content_title: e.target.value })
                    }
                  />
                  <RichTextEditor
                    label="Content"
                    value={selected.content_description}
                    onChange={(v) =>
                      setSelected({ ...selected, content_description: v })
                    }
                  />
                  <label className="flex items-center gap-2 text-sm text-stone-700">
                    <input
                      type="checkbox"
                      checked={selected.content_active === "true"}
                      onChange={(e) =>
                        setSelected({
                          ...selected,
                          content_active: e.target.checked ? "true" : "false",
                        })
                      }
                      className="rounded border-stone-300"
                    />
                    Active (visible on site)
                  </label>
                </FormSection>
                <SaveButton loading={saving} />
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
}
