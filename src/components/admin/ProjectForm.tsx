"use client";

import { useState } from "react";
import { FormField, FormSection, SaveButton, TextAreaField } from "./FormField";
import RichTextEditor from "./RichTextEditor";
import ImagePicker from "./ImagePicker";
import SlugInput from "./SlugInput";
import { ServicePicker } from "./RelationPicker";
import { Service } from "@/types/cms";

export interface ProjectFormData {
  project_name: string;
  project_description: string;
  project_image: string;
  project_pagename: string;
  project_location: string;
  project_type: string;
  project_date: string;
  project_client: string;
  project_budget: string;
  project_duration: string;
  project_content: string;
  project_active: boolean;
  serviceId: string;
}

interface ProjectFormProps {
  initial: ProjectFormData;
  services: Service[];
  onSubmit: (data: ProjectFormData) => Promise<void>;
  submitLabel?: string;
  gallerySection?: React.ReactNode;
}

export default function ProjectForm({
  initial,
  services,
  onSubmit,
  submitLabel,
  gallerySection,
}: ProjectFormProps) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.project_name.trim()) {
      setError("Project name is required");
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
          label="Project name"
          value={form.project_name}
          onChange={(e) => update("project_name", e.target.value)}
          required
        />
        <SlugInput
          value={form.project_pagename}
          onChange={(v) => update("project_pagename", v)}
          sourceText={form.project_name}
        />
        <TextAreaField
          label="Short description"
          value={form.project_description}
          onChange={(e) => update("project_description", e.target.value)}
          rows={3}
        />
        <ImagePicker
          label="Cover image"
          value={form.project_image}
          onChange={(v) => update("project_image", v)}
        />
        <ServicePicker
          services={services}
          value={form.serviceId}
          onChange={(v) => update("serviceId", v)}
        />
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={form.project_active}
            onChange={(e) => update("project_active", e.target.checked)}
            className="rounded border-stone-300"
          />
          Active (visible on site)
        </label>
      </FormSection>

      <FormSection title="Project details">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Location"
            value={form.project_location}
            onChange={(e) => update("project_location", e.target.value)}
          />
          <FormField
            label="Type"
            value={form.project_type}
            onChange={(e) => update("project_type", e.target.value)}
          />
          <FormField
            label="Date"
            value={form.project_date}
            onChange={(e) => update("project_date", e.target.value)}
          />
          <FormField
            label="Client"
            value={form.project_client}
            onChange={(e) => update("project_client", e.target.value)}
          />
          <FormField
            label="Budget"
            value={form.project_budget}
            onChange={(e) => update("project_budget", e.target.value)}
          />
          <FormField
            label="Duration"
            value={form.project_duration}
            onChange={(e) => update("project_duration", e.target.value)}
          />
        </div>
        <RichTextEditor
          label="Full content"
          value={form.project_content}
          onChange={(v) => update("project_content", v)}
        />
      </FormSection>

      {gallerySection}

      <SaveButton loading={loading} label={submitLabel} />
    </form>
  );
}
