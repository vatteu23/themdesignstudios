"use client";

import { useState } from "react";
import { FormField, FormSection, SaveButton } from "./FormField";
import RichTextEditor from "./RichTextEditor";
import ImagePicker from "./ImagePicker";
import SlugInput from "./SlugInput";
import { ProjectMultiPicker } from "./RelationPicker";
import { Service, Project } from "@/types/cms";

export interface ServiceFormData {
  service_name: string;
  service_description: string;
  service_image: string;
  service_pagename: string;
  service_order: number;
  service_active: boolean;
  linkedProjectIds: string[];
}

interface ServiceFormProps {
  initial: ServiceFormData;
  projects: Project[];
  onSubmit: (data: ServiceFormData) => Promise<void>;
  submitLabel?: string;
}

export default function ServiceForm({
  initial,
  projects,
  onSubmit,
  submitLabel,
}: ServiceFormProps) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ServiceFormData>(
    key: K,
    value: ServiceFormData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.service_name.trim()) {
      setError("Service name is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(form);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <FormSection title="Basic information">
        <FormField
          label="Service name"
          value={form.service_name}
          onChange={(e) => update("service_name", e.target.value)}
          required
        />
        <SlugInput
          value={form.service_pagename}
          onChange={(v) => update("service_pagename", v)}
          sourceText={form.service_name}
        />
        <RichTextEditor
          label="Description"
          value={form.service_description}
          onChange={(v) => update("service_description", v)}
        />
        <ImagePicker
          label="Hero image"
          value={form.service_image}
          onChange={(v) => update("service_image", v)}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Display order"
            type="number"
            value={form.service_order}
            onChange={(e) => update("service_order", parseInt(e.target.value) || 0)}
          />
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={form.service_active}
                onChange={(e) => update("service_active", e.target.checked)}
                className="rounded border-stone-300"
              />
              Active (visible on site)
            </label>
          </div>
        </div>
      </FormSection>

      <FormSection title="Related projects">
        <ProjectMultiPicker
          projects={projects}
          value={form.linkedProjectIds}
          onChange={(v) => update("linkedProjectIds", v)}
        />
      </FormSection>

      <SaveButton loading={loading} label={submitLabel} />
    </form>
  );
}

export function serviceToFormData(
  service: Service,
  linkedProjectIds: string[]
): ServiceFormData {
  return {
    service_name: service.service_name,
    service_description: service.service_description ?? "",
    service_image: service.service_image ?? "",
    service_pagename: service.service_pagename ?? "",
    service_order: service.service_order ?? 0,
    service_active: service.service_active !== false,
    linkedProjectIds,
  };
}
