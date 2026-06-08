"use client";

import { Project, Service } from "@/types/cms";

interface ServicePickerProps {
  services: Service[];
  value: string;
  onChange: (serviceId: string) => void;
  label?: string;
}

export function ServicePicker({
  services,
  value,
  onChange,
  label = "Linked service",
}: ServicePickerProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-stone-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
      >
        <option value="">No service</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.service_name}
          </option>
        ))}
      </select>
    </div>
  );
}

interface ProjectMultiPickerProps {
  projects: Project[];
  value: string[];
  onChange: (projectIds: string[]) => void;
  label?: string;
}

export function ProjectMultiPicker({
  projects,
  value,
  onChange,
  label = "Linked projects",
}: ProjectMultiPickerProps) {
  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-stone-700">{label}</label>
      <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-stone-200 p-3">
        {projects.length === 0 ? (
          <p className="text-sm text-stone-500">No projects available</p>
        ) : (
          projects.map((p) => (
            <label
              key={p.id}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-stone-50"
            >
              <input
                type="checkbox"
                checked={value.includes(p.id)}
                onChange={() => toggle(p.id)}
                className="rounded border-stone-300"
              />
              <span className="text-sm text-stone-700">{p.project_name}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
